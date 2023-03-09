import 'dart:convert';
import 'dart:ffi';
import 'package:app/signup.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;

class AuthPage extends StatefulWidget {
  @override
  _AuthPageState createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  bool isRememberMe = false;
  String _selectedusernameOrEmail ='';
  String _selectedpassword='';
  bool _isLoading = false;
  final _formKey = GlobalKey<FormState>();
  final _usernameOrEmailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _errorMessage = '';
  void dispose(){
    _usernameOrEmailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submitForm() async {
    
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      final url = Uri.parse('http://10.0.2.2:5002/signin'); 
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'usernameoremail':_usernameOrEmailController.text,
          'password':_passwordController.text,
        }),
      );
      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        // save token to shared preferences or somewhere else
        final token = responseData['token'];
        // navigate to the next page
        Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => SignupScreen()),
          );
      } else {
        final errorMessage = json.decode(response.body)['message'];
        setState(() {
          _errorMessage = errorMessage;
        });
      }
    }
  }
  
  Widget buildEmail() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text(
        'Email Or Username',
        style: TextStyle(
          color: Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
      SizedBox(height: 10),
      Container(
        alignment: Alignment.centerLeft,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 6,
              offset: Offset(0, 2),
            ),
          ],
        ),
        height: 60,
        child: TextFormField(
          controller: _usernameOrEmailController,
          decoration: InputDecoration(
            icon: Icon(
              Icons.person,
              color: Colors.blue,
            ),
            labelText: 'Username or email',
            hintText: 'Enter Username/ Email',
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.blue),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.blue),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.red),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.red),
            ),
          ),
          validator: (value) {
            if (value!.isEmpty) {
              return 'Please enter your username or email';
            }
            return null;
          },
          onSaved: (value) {
            _selectedusernameOrEmail=value!;
            _usernameOrEmailController.text =_selectedusernameOrEmail;
          },
        ),
      ),
    ],
  );
}
  
  Widget buildPassword() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text(
        'Password',
        style: TextStyle(
            color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
      ),
      SizedBox(height: 10),
      Container(
        alignment: Alignment.centerLeft,
        decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            boxShadow: [
              BoxShadow(
                  color: Colors.black26, blurRadius: 6, offset: Offset(0, 2))
            ]),
        height: 60,
        child: TextFormField(
          controller: _passwordController,
          decoration: InputDecoration(
            icon: Icon(
              Icons.vpn_key,
              color: Colors.blue,
            ),
            labelText: 'Password',
            hintText: 'Enter Password',
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.blue),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.blue),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.red),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.red),
            ),
          ),
          obscureText: true,
          validator: (value) {
            if (value!.isEmpty) {
              return 'Please enter your password';
            }
            return null;
          },
          onSaved: (value) {
            _selectedpassword=value!;
            _passwordController.text =_selectedpassword;
          },
        ),
      ),
    ],
  );
}
  
  Widget buildLoginBtn() {
  return Container(
    padding: EdgeInsets.symmetric(vertical: 25.0),
    width: double.infinity,
    child: ElevatedButton(
      onPressed: _submitForm,
      style: ElevatedButton.styleFrom(
        elevation: 5.0,
        primary: Colors.white,
        padding: EdgeInsets.all(15.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30.0),
        ),
      ),
      child: Text(
        'LOGIN',
        style: GoogleFonts.openSans(
          color: Colors.blue,
          letterSpacing: 1.5,
          fontSize: 18.0,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
  );
}
  
  Widget buildRememberCb() {
return Container(
height: 20,
child: Row(
children: <Widget>[
Theme(
data: ThemeData(unselectedWidgetColor: Colors.white),
child: Checkbox(
value: isRememberMe,
checkColor: Colors.green,
activeColor: Colors.white,
onChanged: (value) {
setState(() {
isRememberMe = value!;
});
},
),
),
Text(
'Remember me',
style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
)
],
),
);
}
  
  Widget buildForgotPassBtn() {
  return Container(
    alignment: Alignment.centerRight,
    child: Padding(
      padding: const EdgeInsets.only(right: 0),
      child: TextButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('Reset Password'),
                content: Container(
                  height: 120,
                  child: Column(
                    children: [
                      TextFormField(
                        decoration: InputDecoration(
                          labelText: 'Email',
                          hintText: 'Enter your email',
                        ),
                      ),
                      SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          // Handle reset password
                        },
                        child: Text('Reset Password'),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
        child: Text(
          'Forgot Password?',
          style: TextStyle(color: Colors.blue),
        ),
      ),
    ),
  );
}
  
  Widget buildSignupBtn() {
  return Row(
    children: [
      Text(
        "Not have Account ? ",
        style: TextStyle(
          color: Colors.black,
          fontWeight: FontWeight.bold,
        ),
      ),
      InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => SignupScreen()),
          );
        },
        child: Text(
          "Signup",
          style: TextStyle(
            color: Colors.blue,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    ],
  );
}



  @override
  Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: Text('Login')),
    body: SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (_errorMessage.isNotEmpty)
                Text(_errorMessage, style: TextStyle(color: Colors.red)),
              SizedBox(height: 50),
              buildEmail(),
              SizedBox(height: 20),
              buildPassword(),
              buildForgotPassBtn(),
              buildRememberCb(),
              buildLoginBtn(),
              buildSignupBtn(),
            ],
          ),
        ),
      ),
    ),
  );
}}
