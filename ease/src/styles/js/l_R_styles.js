import { StyleSheet } from 'react-native';

const l_R_styles = StyleSheet.create({
  container:{
    flex:1
  },
  ImageBackground:{
    height:"100%",
    paddingHorizontal: 20,
    alignItems:'center'
  },
  inputContainer:{
    height: 450,
    width:"100%",
    backgroundColor:"white",
    borderRadius:20,
    justifyContent:"center",
    marginTop: 170,
    paddingHorizontal:25,
  },
  title:{
    fontSize:40,
    color:"white"
  },
  border:{
    width:"100%",
    backgroundColor:"gray",
    height:1,
    alignSelf:"center",
  },
  ImageLogo:{
    width:100,
    height:100,
    alignSelf:"center",
    borderRadius:30,
    marginBottom:20,
  },
  linkText: {
    marginTop: 15,
    color: "blue"
  },
  passwordRequirementsContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  passwordRequirement: {
    color: 'red',
    fontSize: 12,
  },
});

export default l_R_styles;