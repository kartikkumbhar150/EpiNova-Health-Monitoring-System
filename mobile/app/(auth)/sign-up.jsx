import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo'
import VerifyEmailScreen from './verify-email'
import { authStyles } from '../../assets/styles/auth.styles'
import { Image } from 'expo-image'
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'


const SignUpScreen = () => {

  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [PendingVerification, setPendingVerification] = useState(false);


  const roles = [
    {
      id: 'asha-worker',
      label: 'Asha Worker',
      description: 'Field health worker'
    },
    {
      id: 'health_official',
      label: 'Health Official',
      description: 'Supervisor, data analysis, management'
    }
  ]


  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password")
      return;
    }
    if (!isLoaded) return;

    // Debug logging
    console.log("Email:", email);
    console.log("Password:", password ? "***" : "empty");

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password: password
      })

      await signUp.update({
        unsafeMetadata: {
          role: selectedRole,
          createdAt: new Date().toISOString(),
        }
      });
      console.log("Role saved to metadata:", selectedRole);


      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true)
    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.message || "Sign up failed")
      console.error("Sign up error:", error.message || error)
    } finally {
      setLoading(false);
    }

  };

  const handleBackToSignIn = () => {
    setPendingVerification(false);
    router.push('/(auth)/sign-in');
  };

  if (PendingVerification) return <VerifyEmailScreen email={email} onBack={handleBackToSignIn} />


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
          <View
            style={authStyles.imageContainer}
          >
            <Image
              source={require("../../assets/images/a222.png")}
              style={authStyles.image}
              contentFit='contain'
            />
          </View>
          <Text style={authStyles.title}>
            Create Account
          </Text>
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
                color={COLORS.textLight} />
            </TouchableOpacity>
          </View>


          {/*ROle select*/}
          <View style={authStyles.roleSection}>
            <Text style={authStyles.roleTitle}>Select Your Role</Text>
            
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  authStyles.roleCard,
                  selectedRole === role.id && authStyles.selectedRoleCard
                ]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.7}
              >
                <View style={authStyles.roleContent}>
                  <View style={authStyles.radioButton}>
                    {selectedRole === role.id && (
                      <View style={authStyles.radioSelected} />
                    )}
                  </View>
                  
                  <View style={authStyles.roleInfo}>
                    <Text style={[
                      authStyles.roleLabel,
                      selectedRole === role.id && authStyles.selectedRoleLabel
                    ]}>
                      {role.label}
                    </Text>
                    <Text style={[
                      authStyles.roleDescription,
                      selectedRole === role.id && authStyles.selectedRoleDescription
                    ]}>
                      {role.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {selectedRole && <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled
            ]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Creating Account..." : `Sign Up as ${roles.find(r=>r.id===selectedRole)?.label}`}
            </Text>
          </TouchableOpacity>}

          {/* Dont have account signup */}
          <TouchableOpacity>
            <Text style={authStyles.linkText}>
              Already have an account? <Text style={authStyles.link} onPress={() => router.push("/sign-in")}>Sign In</Text>
            </Text>
          </TouchableOpacity>


        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUpScreen