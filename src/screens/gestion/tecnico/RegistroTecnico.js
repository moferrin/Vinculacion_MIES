import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { styles } from "../../../estilos/styleRegistro";

// const { width: WIDTH } = Dimensions.get("window");

export const RegistroTecnico = (props) => {
  //ID del supervisor
  const { id } = useSelector((state) => state.auth);
  const navigation = props.navigation;
  //const tecnicosRegistrados = props.route.params.registroTecnico;
  const [state, setState] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    correo: "",
    direccion: "",
    contraseña: "",
    showPass: true,

    cedulaValidate: {
      estado:false,
      msg:"Debe ingresar una cédula válida"
    },
    nombreValidate: false,
    apellidoValidate: false,
    telefonoValidate: false,
    correoValidate: false,
    direccionValidate: false,
    contraseñaValidate: false,
    disabled:true
  });

  const [value, setValue] = useState({
    press: false,
    showPass: true,
  });
 
  const registroTecnico = async () => {
    //alert('OK');
    const { nombre } = state;
    const { apellido } = state;
    const { cedula } = state;
    const { telefono } = state;
    const { correo } = state;
    const { direccion } = state;
    const { contraseña } = state;

    try {
      const response = await fetch("http://192.188.58.82:3000/guardarTecnico", {
          method: "POST",
          headers: {
            "Accept": "Application/json",
            "Content-type": "Application/json",
          },
          body: JSON.stringify({
            sup_id: parseInt(id), 
            tec_nombre: nombre,
            tec_apellido: apellido,
            tec_cedula: cedula,
            tec_telefono: telefono,
            tec_correo: correo,
            tec_direccion: direccion,
            tec_contraseña: contraseña,
          }),
        })
        console.log(response.status)
        if(response.status == 200){
          //const json = await response.json();
          navigation.replace("HeaderInicio");
        }else{
          Alert.alert("MIES APP", "Ha existido un error",[
            {
              text: "Continuar",
              style: "destructive",
            }
          ]);
        }
    } catch (error) {
      console.log(error);
    }
  };
  


  const showPass = () => {
    if (value.press == false) {
      setValue({
        ...value,
        showPass: false,
        press: true,
      });
    } else {
      setValue({
        ...value,
        showPass: true,
        press: false,
      });
    }
  };
  
  //validaciones de datos
    const validateCedula = (cedula) => {
      var alph = /^([0-9]{0,10})$/;
      var cedInv=false;
      if (alph.test(cedula)) {

        let digProv = parseInt(cedula.substring(0,2));
        console.log(digProv);
        //validar dos primeros digitos de provincia
        if(digProv < 0 || digProv > 24){
          console.log("Codigo de Provincia (dos primeros dígitos) no deben ser mayor a 24 ni menores a 0')");
          cedInv=true;
        }
        //validar tercer digito
        let tercerDig = parseInt(cedula[2]);
        console.log(tercerDig);
        if(tercerDig < 0 || tercerDig > 5){
          console.log("Tercer dígito debe ser mayor o igual a 0 y menor a 6");
          cedInv=true;
        }
        //algoritmo de modulo 10
        let digitosIniciales = cedula.substring(0,9).split("");
        let digitoVerificador = parseInt(cedula[9]);
        let arrayCoeficientes = [2,1,2,1,2,1,2,1,2];
        let total = 0;
        digitosIniciales.forEach(function (value,key){
          let valorPosicion = (parseInt(value)*arrayCoeficientes[key]);

          if(valorPosicion>=10){
            valorPosicion=valorPosicion.toString().split("");

            valorPosicion= valorPosicion.reduce(function(a, b){
              return parseInt(a) + parseInt(b);
            }, 0);
            
          }
          total+=valorPosicion;
        });

        let residuo = total%10;
        let resultado=0;
        if (residuo != 0) {
          resultado = 10 -residuo;
        }

        if (resultado != digitoVerificador){
          console.log("Dígitos iniciales no validan contra Dígito Idenficador");
          cedInv=true;
        }

        if(cedInv){
          setState({ ...state,  cedulaValidate:{msg:"Cedula Invalida",estado:false} });
        }else{
          setState({ ...state,  cedulaValidate:{msg:"",estado:true},cedula:cedula });
        }
        
      } else {
        setState({ ...state,  cedulaValidate:{msg:"No se permiten letras",estado:false} });
      }
    };
  
  const validateNombre = (nombre, type) => {
    var alph =
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    if (type == "nombre") {
      if (alph.test(nombre)) {
        setState({ ...state, nombreValidate: true, nombre: nombre });
        console.log("nombre: " +state.nombreValidate)
      } else {
        setState({ ...state, nombreValidate: false });
        console.log("nombre: " +state.nombreValidate)
      }
    }
  };

  const validateApellido = (apellido, type) => {
    var alph =
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
    if (type == "apellido") {
      if (alph.test(apellido)) {
        setState({ ...state, apellidoValidate: true, apellido: apellido, disabled: false });
        console.log("ape: " + state.apellidoValidate)
      } else {
        setState({ ...state, apellidoValidate: false, disabled: true });
        console.log("ape: " + state.apellidoValidate)
      }
    }
  };

  const validateTelefono = (telefono, type) => {
    var alph = /^([0-9]{0,10})$/;
    if (type == "telefono") {
      if (alph.test(telefono)) {
        setState({ ...state, telefonoValidate: true, telefono: telefono, disabled: false });
        console.log("cell: " +state.telefonoValidate)
      } else {
        setState({ ...state, telefonoValidate: false, disabled: true });
        console.log("cell: " +state.telefonoValidate)
      }
    }
  };

  const validateCorreo = (correo, type) => {
    if (type == "correo") {
        setState({ ...state, correoValidate: true, correo: correo, disabled: false });
        console.log("corre: " +state.correoValidate)
      }else {
        setState({ ...state, correoValidate: false, disabled: true });
        console.log("corre: " +state.correoValidate)
    }
  };

  const validateDireccion = (direccion, type) => {
    if (type == "direccion") {
        setState({ ...state, direccionValidate: true, direccion: direccion, disabled: false });
        console.log("dir: " +state.direccionValidate)
      }else {
        setState({ ...state, direccionValidate: false, disabled: true });
        console.log("dir: " +state.direccionValidate)
    }
  };

  const validateContraseña = (contraseña, type) => {
    if (type == "contraseña") {
        setState({ ...state, contraseñaValidate: true, contraseña: contraseña, disabled: false });
        console.log("contra: " +state.contraseñaValidate)
      }else {
        setState({ ...state, contraseñaValidate: false, disabled: true });
        console.log("contra: " +state.contraseñaValidate)
    }
  };

  const validarEntradaDatos = () => {
    console.log("nombre: " +state.nombreValidate)
    console.log("ape: " +state.apellidoValidate)
    console.log("cedu: " +state.cedulaValidate.estado)
    console.log("tele: " +state.telefonoValidate)
    console.log("correo: " +state.correoValidate)
    console.log("direcc: " +state.direccionValidate)
    console.log("contra: " +state.contraseñaValidate)
    if (
      state.nombreValidate == true &&
      state.apellidoValidate == true &&
      state.cedulaValidate.estado == true &&
      state.telefonoValidate == true &&
      state.correoValidate == true &&
      state.direccionValidate == true &&
      state.contraseñaValidate == true
    ) {
      registroTecnico();
    } else {
      console.log("datos")
      Alert.alert("MIES APP", "Debe ingresar todos los datos", [
        {
          text: "Continuar",
          style: "destructive",
        },
      ]);
    }
  };

  // validateCorreo(text, type) {
  //   var alph =
  //     /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
  //   if (type == "correo") {
  //     if (alph.test(correo)) {
  //       this.setState({ correoValidate: true });
  //       this.setState({ correo });
  //     } else {
  //       this.setState({ correoValidate: false });
  //     }
  //   }
  // }

  // validateNombre_usuario(direccion, type) {
  //   var alph =
  //     /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+([0-9]{0,10})+$/g;
  //   if (type == "direcccion") {
  //     if (alph.test(direccion)) {
  //       this.setState({ dirreccionValidate: true });
  //       this.setState({ dirreccion });
  //     } else {
  //       this.setState({ dirrecionValidate: false });
  //     }
  //   }
  // }

  // validateClave(contraseña, type) {
  //   var alph =
  //     /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
  //   if (type == "contraseña") {
  //     if (alph.test(contraseña)) {
  //       this.setState({ contraseñaValidate: true });
  //       this.setState({ contraseña });
  //     } else {
  //       this.setState({ contraseñaValidate: false });
  //     }
  //   }
  // }

  return (
      <ScrollView
        style={styles.scrollView}
      >
        <View tyle={styles.tituloContainer}>
          <Text style={styles.TituloLogin}>Formulario de Registro Técnico</Text>
        </View>

        <View style={styles.inputContainer}>
        <Ionicons
          name={"person-outline"}
          size={28}
          color={"rgba(0,0,0,1)"}
          style={styles.inputIcon}
        />
          <TextInput
            style={[
              styles.input,
              !state.nombreValidate ? styles.inputError : null,
            ]}
            placeholder={"Ingrese el nombre"}
            placeholderTextColor={"rgba(0,0,0,0.7)"}
            underlineColorAndroid="transparent"
            onChangeText={(nombre) => validateNombre(nombre, "nombre")}
          />
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.TextDefault,
              !state.nombreValidate ? styles.TextError : null,
              state.nombreValidate ? styles.TextErrorValid : null,
            ]}
          >Solo se permiten letras
          </Text>
        </View>

        <View style={styles.inputContainer}>
        <Ionicons
          name={"person-outline"}
          size={30}
          color={"rgba(0,0,0,1)"}
          style={styles.inputIcon}
        />
          <TextInput
            style={[
              styles.input,
              !state.apellidoValidate ? styles.inputError : null,
            ]}
            placeholder={"Ingrese el apellido"}
            placeholderTextColor={"rgba(0,0,0,0.7)"}
            underlineColorAndroid="transparent"
            onChangeText={(apellido) => validateApellido(apellido, "apellido")
            }
          />
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.TextDefault,
              !state.apellidoValidate ? styles.TextError : null,
              state.apellidoValidate ? styles.TextErrorValid : null,
            ]}
          >Solo se permiten letras
          </Text>
        </View>

        <View style={styles.inputContainer}>
        <Ionicons
          name={"finger-print-outline"}
          size={30}
          color={"rgba(0,0,0,1)"}
          style={styles.inputIcon}
        />
          <TextInput
            style={[
              styles.input,
              !state.cedulaValidate ? styles.inputError : null,
            ]}
            placeholder={"Cédula"}
            placeholderTextColor={"rgba(0,0,0,0.7)"}
            underlineColorAndroid="transparent"
            maxLength={10}
            onChangeText={(cedula) => validateCedula(cedula, "cedula")}
          />
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.TextDefault,
              !!state.cedulaValidate ? styles.TextError : null,
              !state.cedulaValidate ? styles.TextErrorValid : null,
            ]}
          >
            {state.cedulaValidate.msg}
          </Text>
        </View>

        <View style={styles.inputContainer}>
        <Ionicons
          name={"phone-portrait-outline"}
          size={28}
          color={"rgba(0,0,0,1)"}
          style={styles.inputIcon}
        />
          <TextInput
            style={[
              styles.input,
              !state.telefonoValidate ? styles.inputError : null,
            ]}
            placeholder={"Teléfono"}
            placeholderTextColor={"rgba(0,0,0,0.7)"}
            underlineColorAndroid="transparent"
            maxLength={10}
            onChangeText={(telefono) => validateTelefono(telefono, "telefono")}
            //onChangeText = {(text) => setState({})}
          />
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.TextDefault,
              !state.telefonoValidate ? styles.TextError : null,
              state.telefonoValidate ? styles.TextErrorValid : null,
            ]}
          >Debe ingresar 10 digitos numéricos
          </Text>
        </View>

        <View style={styles.inputContainer}>
        <Ionicons
          name={"mail-outline"}
          size={28}
          color={"rgba(0,0,0,1)"}
          style={styles.inputIcon}
        />
          <TextInput
            style={[
              styles.input,
              !state.correoValidate ? styles.inputError : null,
            ]}
            placeholder={"Correo"}
            placeholderTextColor={"rgba(0,0,0,0.7)"}
            underlineColorAndroid="transparent"
            onChangeText={(correo) =>
              validateCorreo(correo, "correo")
            }
          />
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.TextDefault,
              !state.correoValidate ? styles.TextError : null,
              state.correoValidate ? styles.TextErrorValid : null,
            ]}
          >
          </Text>
        </View>

        <View style={styles.inputContainer}>
        <Ionicons
          name={"location-outline"}
          size={28}
          color={"rgba(0,0,0,1)"}
          style={styles.inputIcon}
        />
          <TextInput
            style={[
              styles.input,
              !state.direccionValidate ? styles.inputError : null,
            ]}
            placeholder={"Direccion"}
            placeholderTextColor={"rgba(0,0,0,0.7)"}
            underlineColorAndroid="transparent"
            onChangeText={(direccion) =>
              validateDireccion(direccion, "direccion")
            }
          />
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.TextDefault,
              !state.direccionValidate ? styles.TextError : null,
              state.direccionValidate ? styles.TextErrorValid : null,
            ]}
          ></Text>
        </View>

        <View style={styles.inputContainer}>
        <Ionicons
          name={"key-outline"}
          size={28}
          color={"rgba(0,0,0,1)"}
          style={styles.inputIcon}
        />
          <TextInput
            style={[
              styles.input,
              !state.contraseñaValidate ? styles.inputError : null,
            ]}
            placeholder={"Contraseña"}
            placeholderTextColor={"rgba(0,0,0,0.7)"}
            underlineColorAndroid="transparent"
            secureTextEntry={value.showPass}
            onChangeText={(contraseña) =>
              validateContraseña(contraseña, "contraseña")
            }
          />

        <TouchableOpacity style={styles.btnEye} onPress={showPass.bind()}>
            <Ionicons
              name={
                value.press == false ? "ios-eye-outline" : "ios-eye-off-outline"
              }
              size={26}
              color={"rgba(0,0,0,1)"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.TextDefault,
              !state.contraseñaValidate ? styles.TextError : null,
              state.contraseñaValidate ? styles.TextErrorValid : null,
            ]}
          ></Text>
        </View>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <TouchableOpacity
          disabled={state.disabled}
          style={[
              state.disabled ? styles.btnRegistrarDisabled : null,
              !state.disabled ? styles.btnRegistrar : null,
            ]}
          onPress={validarEntradaDatos}
          >
            <Text style={styles.text}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnCancelar}
            onPress={() => navigation.replace("HeaderInicio")}
          >
            <Text style={styles.text}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};
