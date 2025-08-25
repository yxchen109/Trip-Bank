import { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity } from 'react-native'
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInFormSchema, type SignInFormSchemaType } from '@components/SignIn'
import { Ionicons } from '@expo/vector-icons';
import styles from "@style/SignIn.style";
import { router } from 'expo-router';
import { useSession } from '../../ctx';

const SignInScreen = ({ navigation }) => {
    const { signIn } = useSession();
    const { control, handleSubmit } = useForm<SignInFormSchemaType>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
          email: '',
          password: ''
        },
        mode: 'onChange'
     })
    
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const onSubmit: SubmitHandler<SignInFormSchemaType> = (formData) => {
      console.log(formData) // {"email": "test@gmail.com", "password": "123456"}
    }
    const onError: SubmitErrorHandler<SignInFormSchemaType> = (errors) => {
      console.log(errors)
    }

    return (
    <View style={styles.container}>
      <Image
        source={require('@assets/images/signin.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>SIGN IN</Text>

      <Controller // Username
        control={control}
        name="email"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View style={styles.emailContainer}>
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
            <View style={styles.pwContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                onBlur={onBlur}
                value={value}
                secureTextEntry={!showPassword} // show/hide Password
                onChangeText={onChange}
              />
              {!!error?.message && <Text style={styles.errorMessage}>{error.message}</Text>}
              
              <TouchableOpacity style={styles.showPasswordIcon} onPress={toggleShowPassword}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
              </TouchableOpacity>

              {/* Forgot Password? */}
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity onPress={() => alert('Coming Soon!')}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Sign in */}
      <TouchableOpacity style={styles.siButton} onPress={handleSubmit(onSubmit, onError)}>
        <Text style={styles.siText}>Sign in</Text>
      </TouchableOpacity> 

       {/* Don't have an account? Sign up */}
      <View style={styles.suContainer}>
        <Text style={styles.suText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => {
          //navigation.pop();
          router.push('/login/signUp')}
        }>
          <Text style={styles.suLink}>Sign up</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
};

export default SignInScreen;