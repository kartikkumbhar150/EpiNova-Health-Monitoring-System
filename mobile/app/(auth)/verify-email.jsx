import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { authStyles } from '../../assets/styles/auth.styles'
import { Image } from 'expo-image'
import { COLORS } from '../../constants/colors'



const VerifyEmailScreen = ({onBack,email}) => {
  const { isLoaded , signUp, setActive } = useSignUp();
  const router = useRouter();
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false);

  const handleVerify = async()=>{
    if(!isLoaded) return;
    
    if (!code || code.length < 6) {
      Alert.alert("Error", "Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting verification with code:", code);
      
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code
      })

      console.log("Verification attempt result:", signUpAttempt.status);

      if(signUpAttempt.status === "complete"){
        await setActive({session: signUpAttempt.createdSessionId})
        Alert.alert("Success", "Email verified successfully!");
      } else if (signUpAttempt.status === "missing_requirements") {
        console.error("Missing requirements:", signUpAttempt.missingFields);
        Alert.alert("Error", `Missing required information: ${signUpAttempt.missingFields?.join(', ') || 'Unknown fields'}`)
      } else {
        Alert.alert("Error","Verification Failed. Please try again")
        console.error("Verification incomplete. Status:", signUpAttempt.status)
      }
      
    } catch (error) {
      console.error("Verification error:", error.message || "Unknown error");
      console.error("Error code:", error.code || "No code");
      Alert.alert("Error", error.errors?.[0]?.message || "Verification Failed")
      
    } finally {
      setLoading(false);
    }
  }

  const handleBackToSignIn = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/(auth)/sign-in');
    }
  }


  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
        style={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
          <View
          style={authStyles.imageContainer}
          >
            <Image
            source={require("../../assets/images/a333.png")}
            style={authStyles.image}
            contentFit='contain'
            />
          </View>
          <Text style={authStyles.title}>Verify Email</Text>
          <Text style={authStyles.subtitle}>We have sent the Verification
             code to {email}</Text>
          <View
          style={authStyles.formContainer}>
            <View
            style={authStyles.inputContainer}>
              <TextInput
              style={authStyles.textInput}
              placeholder='Enter Code'
              placeholderTextColor={COLORS.textLight}
              value={code}
              onChangeText={setCode}
              keyboardType='numeric'
              autoCapitalize='none'
              />
            </View>

            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled
              ]}
              onPress={handleVerify}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>

            {/* Resend Code Button */}
            <TouchableOpacity 
              style={{marginTop: 20}}
              onPress={async () => {
                try {
                  await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                  Alert.alert("Success", "Verification code sent again!");
                } catch (error) {
                  Alert.alert("Error", "Failed to resend code");
                }
              }}
            >
              <Text style={[authStyles.linkText, {textAlign: 'center'}]}>
                Didn't receive code? <Text style={authStyles.link}>Resend</Text>
              </Text>
            </TouchableOpacity>

            {/* Back to Sign In*/}
            <TouchableOpacity onPress={handleBackToSignIn}>
              <Text style={authStyles.linkText}>
                Back to <Text style={authStyles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

        
        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyEmailScreen
