import 'package:app/signin.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';


class SignupScreen extends StatefulWidget {
  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  String _selectedRole ='';
  String _selectedSexe='';
  final _formKey = GlobalKey<FormState>();
  final _nomController = TextEditingController();
  final _prenomController = TextEditingController();
  final _telephoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _sexeController = TextEditingController();
  final _adresseController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _roleController = TextEditingController();
  final _specialiteController = TextEditingController();
  final _dateNaissanceController = TextEditingController();
  String _errorMessage = '';
  bool _isLoading = false;

  @override
  void dispose() {
    _prenomController.dispose();
    _nomController.dispose();
    _sexeController.dispose();
    _telephoneController.dispose();
    _adresseController.dispose();
    _emailController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    _roleController.dispose();
    _specialiteController.dispose();
    _dateNaissanceController.dispose();
    super.dispose();
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      try {
        final url = Uri.parse('http://10.0.2.2:5002/signup');
        final response = await http.post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: json.encode({
            "email": _emailController.text,
            "username": _usernameController.text,
            "password": _passwordController.text,
            "nom": _nomController.text,
            "prenom": _prenomController.text,
            "telephone": _telephoneController.text,
            "adresse": _adresseController.text,
            "sexe": _sexeController.text,
            "role": _roleController.text,
            "specialite": _specialiteController.text,
            "date_naissance": _dateNaissanceController.text,
          }),
        );
        final responseData = json.decode(response.body);
        if (response.statusCode == 200) {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AuthPage()),
          );

           
        } else {
                  debugPrint("here");

          setState(() {
            _errorMessage = responseData['message'];
          });
        }
      } catch (error) {
        setState(() {
          _errorMessage =
              'Une erreur est survenue lors de la creation du medecin ou le patient';
        });
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Inscription'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nomController,
                decoration: InputDecoration(
                  labelText: 'Nom',
                ),
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Veuillez saisir votre nom';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _prenomController,
                decoration: InputDecoration(
                  labelText: 'Prénom',
                ),
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Veuillez saisir votre prénom';
                  }
                  return null;
                },
              ),
              TextFormField(
                keyboardType: TextInputType.phone,
                controller: _telephoneController,
                decoration: InputDecoration(
                labelText: 'Téléphone',
                ),
               validator: (value) {
              if (value!.isEmpty) {
                return 'Veuillez saisir votre numéro de téléphone';
              }
              return null;
              },
              ),

              TextFormField(
                controller: _usernameController,
                decoration: InputDecoration(
                  labelText: 'Nom d\'utilisateur',
                ),
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Veuillez saisir un nom d\'utilisateur';
                  }
                  return null;
                },
              ),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                controller: _emailController,
                decoration: InputDecoration(
                  labelText: 'Adresse email',
                ),
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Veuillez saisir une adresse email';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: 'Mot de passe',
                ),
                obscureText: true,
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Veuillez saisir un mot de passe';
                  }
                  return null;
                },
              ),
              TextFormField(
            controller: _adresseController,
            decoration: InputDecoration(
              labelText: 'Adresse',
            ),
            validator: (value) {
              if (value!.isEmpty) {
                return 'Veuillez saisir votre adresse';
              }
              return null;
            },
          ),
              ListTile(
                title: const Text('homme'),
                leading: Radio(
                  value: 'homme',
                  groupValue: _selectedSexe,
                  onChanged: (String? value) {
                    setState(() {
                      _selectedSexe = value!;
                      _sexeController.text=_selectedSexe;
                    });
                  },
                ),
              ),
              ListTile(
                title: const Text('femme'),
                leading: Radio(
                  value: 'femme',
                  groupValue: _selectedSexe,
                  onChanged: (String? value) {
                    setState(() {
                      _selectedSexe = value!;
                      _sexeController.text=_selectedSexe;
                    });
                  },
                ),
              ),
              ListTile(
                title: const Text('Médecin'),
                leading: Radio(
                  value: 'medecin',
                  groupValue: _selectedRole,
                  onChanged: (String? value) {
                    setState(() {
                      _selectedRole = value!;
                      _roleController.text=_selectedRole;
                    });
                  },
                ),
              ),
              ListTile(
                title: const Text('Patient'),
                leading: Radio(
                  value: 'patient',
                  groupValue: _selectedRole,
                  onChanged: (String? value) {
                    setState(() {
                      _selectedRole = value!;
                       _roleController.text=_selectedRole;
                    });
                  },
                ),
              ),
              Visibility(
                visible: _selectedRole=='medecin'?true:false,
                child: TextFormField(
                  controller: _specialiteController,
                  decoration: InputDecoration(
                    labelText: 'Spécialité',
                  ),
                  validator: (value) {
                    if (_selectedRole == 'medecin' && value!.isEmpty) {
                      return 'Veuillez saisir une spécialité';
                    }
                    return null;
                  },
                ),
              ),
              Visibility(
                visible: _selectedRole=='patient'?true:false,
                child:TextFormField(
                controller: _dateNaissanceController,
                decoration: InputDecoration(
                  labelText: 'Date de naissance (aaaa-mm-jj)',
                ),
                validator: (value) {
                  if (_selectedRole == 'patient' && value!.isEmpty) {
                    return 'Veuillez saisir une date de naissance';
                  }
                  return null;
                },
              ),
              ),
              if (_isLoading)
            Center(
              child: CircularProgressIndicator(),
            )
          else if (_errorMessage.isNotEmpty)
            Center(
              child: Text(
                _errorMessage,
                style: TextStyle(color: Colors.red),
              ),
            ),
          SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: _submitForm,
                child: Text('S\'inscrire'),
               ),
            ],
          ),
        ),
      ),
    );
  }}