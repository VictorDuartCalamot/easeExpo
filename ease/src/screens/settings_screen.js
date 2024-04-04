import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image} from 'react-native';

const SettingsScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = () => {
    // Lógica para cambiar el correo electrónico
    console.log('Cambiar correo electrónico:', email);
    // Aquí puedes agregar la lógica para guardar el nuevo correo electrónico en tu base de datos o enviar una solicitud al servidor.
  };

  const handleChangePassword = () => {
    // Lógica para cambiar la contraseña
    console.log('Cambiar contraseña:', password);
    // Aquí puedes agregar la lógica para guardar la nueva contraseña en tu base de datos o enviar una solicitud al servidor.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Configuración</Text>
      <Image source={require("../pictures/logo.png")}
          style={styles.ImageLogo}>
        </Image>
      <View style={styles.section}>
        <Text style={styles.label}>Cambiar correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nuevo correo electrónico"
        />
        <Button title="Guardar" onPress={handleChangeEmail} />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Cambiar contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Nueva contraseña"
          secureTextEntry={true}
        />
        <Button title="Guardar" onPress={handleChangePassword} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:20,
  },
  section: {
    marginBottom: 20,
  },
  ImageLogo:{
    width:100,
    height:100,
    alignSelf:"center",
    borderRadius:30,
    marginBottom:20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SettingsScreen;
