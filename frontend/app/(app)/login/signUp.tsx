import { useState, useEffect } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { signUpFormSchema, type SignUpFormSchemaType } from '@components/SignUp';
import styles from "@style/SignUp.style";
import { router } from 'expo-router';

const SignUpScreen = ({ navigation }) => {
    const { control, handleSubmit } = useForm<SignUpFormSchemaType>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            email: '',
            username: '',
            password: '',
            password2: ''
        },
        mode: 'onChange'
    })

    //Error box
    const [errorCheck, setErrorCheck] = useState(false);
    const closeErrorBox = () => {
      setErrorCheck(false);
    };
    //Sign up success box 
    const [successCheck, setSuccessCheck] = useState(false);
    useEffect(() => {
        let timeoutId: string | number | NodeJS.Timeout;
        if (successCheck) {
            timeoutId = setTimeout(() => {
                setSuccessCheck(false); 
                router.push('/login/signIn'); 
            }, 2000);   
        } 
       return () => {
         clearTimeout(timeoutId);
       };
    }, [successCheck]);
    //-------------------------------------//
    //Sign up fail message
    const [errorMessage, setErrorMessage] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});
    
    const calculateFailContainerHeight = () => {
        const totalErrors = (errors.email?.length || 0) + (errors.password?.length || 0);
        const lineHeight = 20;
        const calculatedHeight = Math.max(30, totalErrors * lineHeight);
        return calculatedHeight;
    };
    
    const mapErrorMessage = (error: string) => {
        switch (error) {
        case 'This field must be unique.':
            return '*電子郵件已存在';
        case 'This password is too common.':
            return '*密碼不安全';
        case 'This password is entirely numeric.':
            return '*密碼不能全是數字';
        default:
            return error;
        }
    };
    //-------------------------------------//
    //Show password
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const [showcPassword, setShowcPassword] = useState(false);
    const toggleShowcPassword = () => {
      setShowcPassword((prev) => !prev);
    };
    //-------------------------------------//
    //Sign up 
    const onSubmit: SubmitHandler<SignUpFormSchemaType> = (formData) => {
        console.log(formData);
        //API
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        fetch(`${apiUrl}/auth/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify(formData),
        })
        .then((response) => {
            //if (!response.ok) {
                //throw new Error(`HTTP error! Status: ${response.status}`);
            //}
            return response.json();
        })
        .then((json) => {
            if (json.username == formData.username){
                setSuccessCheck(true);
                setErrorCheck(false);
            }
            else {
                setErrorCheck(true);
                setErrors(json);
            };
        })
        .catch((error) => {
          // console.error('Error:', error.message);
        });
      };
   
    const onError: SubmitErrorHandler<SignUpFormSchemaType> = (errors) => {
      console.log(errors)
    }
    //-------------------------------------//
    return(
        <View style={styles.container}> 
            <Image
                source={require('@assets/images/signin.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>註冊</Text>
            
            <Controller // Username
                control={control}
                name="username"
                render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
                }) => {
                    return (
                        <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            onBlur={onBlur}
                            value={value}
                            onChangeText={onChange}
                        />
                        {!!error?.message && <Text style={styles.errorMessage}>{error.message}</Text>}
                        </View>
                    );
                }}
            />
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
                        
                        <TouchableOpacity style={styles.showPasswordIcon} onPress={toggleShowPassword}>
                            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
                        </TouchableOpacity> 
                        </View>
                    );
                }}
            />

            <Controller // Confirm Password
                control={control}
                name="password2"
                render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
                }) => {
                    return (
                        <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            onBlur={onBlur}
                            value={value}
                            secureTextEntry={!showcPassword} // show/hide Password
                            onChangeText={onChange}
                        />
                        {!!error?.message && <Text style={styles.errorMessage}>{error.message}</Text>}
                        
                        <TouchableOpacity style={styles.showPasswordIcon} onPress={toggleShowcPassword}>
                            <Ionicons name={showcPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
                        </TouchableOpacity> 
                        </View>
                    );
                }}
            />

            {/* Sign up */}
            <TouchableOpacity style={styles.suButton} onPress={handleSubmit(onSubmit, onError)}>
                <Text style={styles.suText}>註冊</Text>
                {/* Display errors*/}
                {((errors.email || errors.password) && errorCheck) && (
                    <View style={[styles.failContainer, { height: calculateFailContainerHeight()}]}>
                            {errors.email?.map((error, index) => (
                                <Text key={index} style={{ color: 'red' }}>
                                    <Text>{mapErrorMessage(error)}</Text>
                                </Text>
                            ))}
                            {errors.password?.map((error, index) => (
                                <Text key={index} style={{ color: 'red' }}>
                                    <Text>{mapErrorMessage(error)}</Text>
                                </Text>
                            ))}
                        <TouchableOpacity style={styles.failboxClose} onPress={closeErrorBox}>
                            <AntDesign name="closesquareo" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity> 

            <View style={styles.siContainer}>
                <Text style={styles.siText}>已經有帳號?</Text>
                <TouchableOpacity onPress={() => {router.push('/login/signIn')}}>
                    <Text style={styles.siLink}>登入</Text>
                </TouchableOpacity>
            </View>  
        
            {/*Sign up Success*/}
            {successCheck && (
                <View style={styles.successContainer}>
                    <AntDesign name="checkcircle" style={{marginBottom: 10}} size={80} color="#ED8C40" />
                    <Text style={styles.successMessage}>註冊成功</Text>
                </View>
            )}
        </View>
    )
}

export default SignUpScreen;
