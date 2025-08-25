import { useState, useEffect } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, Modal } from 'react-native'
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInFormSchema, type SignInFormSchemaType } from '@components/SignIn'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import styles from "@style/SignIn.style";
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import errorMap from 'zod/lib/locales/en';
//import { useSession } from '../../ctx'; 

const SignInScreen = ({ navigation }) => {
    //const { signIn } = useSession();
    const { control, handleSubmit } = useForm<SignInFormSchemaType>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
          email: '',
          password: ''
        },
        mode: 'onChange'
     })
    
    //Error box
    const [errorCheck, setErrorCheck] = useState(false);
    const closeErrorBox = () => {
      setErrorCheck(false);
    };
    //-------------------------------------//
    //Sign in success box
    const [successCheck, setSuccessCheck] = useState(false);
    
    useEffect(() => {
      let timeoutId: string | number | NodeJS.Timeout;
      if (successCheck) {
        timeoutId = setTimeout(() => {
          setSuccessCheck(false); 
          console.log(control)
          router.push('/'); 
        }, 2000);
      }
      return () => {
        clearTimeout(timeoutId);
      };
    }, [successCheck]);
    //-------------------------------------//
  
    //Show/hide password
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };
    //-------------------------------------//
  
    //Sign in
    const onSubmit: SubmitHandler<SignInFormSchemaType> = (formData) => {
      // console.log(JSON.stringify(formData))
      //API
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      fetch(`${apiUrl}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(formData),
      })
      .then((response) => {
        /*if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }*/
        return response.json();
      })
      .then((json) => {
        if (json.detail == undefined){
          // console.log(formData);
          global.email = formData.email;
          // console.log('Global data: ',global.email)
          setSuccessCheck(true);
          setErrorCheck(false);
        }
        else {
          // console.log(json.detail);
          setErrorCheck(true);
        };
      })
      .catch((error) => {
        // console.error('Error:', error.message);
      });
    };

    const onError: SubmitErrorHandler<SignInFormSchemaType> = (errors) => {
      // console.log(errors);
      setErrorCheck(true);
    }
    //-------------------------------------//
    return (
      <View style={styles.container}>
      
        <Image
          source={require('@assets/images/signin.png')}
          style={styles.logo}
          resizeMode="contain"
        />
  
        <Text style={styles.title}>登入</Text>
        
        <Controller // Email
          control={control}
          name="email"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email ID"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                />    
                {!!error?.message && <Text style={styles.errorMessage}>{error.message}</Text>}
              </View>
            );
          }}
        />
  
        <Controller // Password
          control={control}
          name="password"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={!showPassword} // show/hide Password
                  onChangeText={onChange}
                />
                {!!error?.message && <Text style={styles.errorMessage}>{error.message}</Text>}
                
                {/* Show/Hide Password Eye */}
                <TouchableOpacity style={styles.showPasswordIcon} onPress={toggleShowPassword}>
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
                </TouchableOpacity>
  
                {/* Forgot Password? */}
                <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity onPress={() => alert('Coming Soon!')}>
                    <Text style={styles.forgotPasswordText}>忘記密碼?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
  
        {/* Sign in */}
        <TouchableOpacity style={styles.siButton} onPress={handleSubmit(onSubmit, onError)}>
          <Text style={styles.siText}>登入</Text>
          {/*Sign in Fail*/}
          {errorCheck && (
            <View style={styles.failContainer}>
              <Text style={styles.failMessage}>請輸入正確帳號和密碼!</Text>
              <TouchableOpacity style={styles.failboxClose} onPress={closeErrorBox}>
                <AntDesign name="closesquareo" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity> 
  
         {/* Don't have an account? Sign up */}
        <View style={styles.suContainer}>
          <Text style={styles.suText}>尚未有帳號?</Text>
          <TouchableOpacity onPress={() => {
            router.push('/login/signUp')}
          }>
            <Text style={styles.suLink}>註冊</Text>
          </TouchableOpacity>
        </View>
  
        {/*Sign in Success*/}
        {successCheck && (
          <View style={styles.successContainer}>
            <AntDesign name="checkcircle" style={{marginBottom: 10}} size={80} color="#ED8C40" />
            <Text style={styles.successMessage}>登入成功</Text>
          </View>
        )}
      
      </View>
    );
};

export default SignInScreen;