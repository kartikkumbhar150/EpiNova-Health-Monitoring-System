import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity,  } from 'react-native'
import {useRouter} from "expo-router"
import {useSignIn} from "@clerk/clerk-expo"
import { useState } from 'react'
import { Image } from 'expo-image'

import { authStyles } from "../../assets/styles/auth.styles"
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'



const SignInScreen = () => {
    const router = useRouter()
  
    const{signIn ,setActive , isLoaded} =useSignIn();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [ShowPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async ()=>{
        if(!email || !password){
            Alert.alert("Error", "Please enter email and password")
            return;
        }
        if(!isLoaded){
            return;
        }
        setLoading(true);
        try {
          const signInAttempt = await signIn.create(
            {identifier: email ,
              password
            })
          if (signInAttempt.status === "complete"){
            await setActive({session:signInAttempt.createdSessionId})
          }else{
            console.log(signInAttempt)
            Alert.alert("Error", "SignIn failed")
            console.error("Sign in incomplete. Status:", signInAttempt.status)
          }
        } catch (error) {
          Alert.alert("Error", error.errors?.[0]?.message || "signin fail")
          
        }finally{
          setLoading(false);
        }

    }


  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView 
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}

        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/a111.png")}
              style={authStyles.image}
              contentFit='contain'
            />

          </View>
          
          <Text style={authStyles.title}>Welcome Back</Text>

          <View style={authStyles.formContainer}>
            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder='Enter Email'
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'

              />
            </View>

            {/* Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder='Enter Password'
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!ShowPassword}
                autoCapitalize='none'

              />
              {/* Eye Icon */}
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!ShowPassword)}
              
              >
                <Ionicons
                  name={ShowPassword ? "eye-off" : "eye"}
                  size={24}
                  color={COLORS.textLight}/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled
              ]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Dont have account signup */}
            <TouchableOpacity>
              <Text style={authStyles.linkText}>
                Don&apos;
                t have an account? <Text style={authStyles.link} onPress={() => router.push("/sign-up")}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

export default SignInScreen