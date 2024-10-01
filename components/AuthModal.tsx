"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader } from "lucide-react"
import { useAuth } from '@/app/AuthContext'
import { auth } from '@/app/firebase'
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { IoPerson } from "react-icons/io5";
export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Clear errors and success messages when switching between modes
    setError('')
    setSuccess('')
  }, [isSignUp, isForgotPassword])

  if (!isAuthModalOpen) return null

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      setIsAuthModalOpen(false)
      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setIsAuthModalOpen(false)
      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setIsAuthModalOpen(false)
      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess('Password reset email sent. Please check your inbox.')
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      await signInAnonymously(auth)
      setIsAuthModalOpen(false)
      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || 'Failed to sign in as guest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative ">
        <button
          onClick={() => setIsAuthModalOpen(false)}
        
          disabled={loading}
        >
          <XMarkIcon  className="modal__close" />
        </button>
        <div className="p-6">
          <h2 className="modal__title">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Log In'}
          </h2>
          {!isForgotPassword && (
            <>
            <div className="modal__buttons">
            <button
                onClick={handleGoogleSignIn}
                
                className="modal__button"
                disabled={loading}
              >
               <FcGoogle className="modal__button__icon" />
               
                {isSignUp ? 'Sign up with Google' : 'Login with Google'}
              </button>
              <button
                onClick={handleGuestSignIn}
                className="modal__button"
                disabled={loading}
              >
                <IoPerson className="modal__button__icon" />
              <span className="modal__button__text">Login as Guest</span>
              </button>
            </div>
             
            </>
          )}
         <div className="break">
              <div className="break__line"></div>
              <div className="break__or">or</div>
              <div className="break__line"></div>
            </div>
          <form onSubmit={isForgotPassword ? handleForgotPassword : isSignUp ? handleEmailSignUp : handleEmailSignIn}>
            <div className="mb-4">
              <label htmlFor="email" className="modal__form__field__label">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                 className="modal__form__field__input"
              />
            </div>
            {!isForgotPassword && (
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                   className="modal__form__field__input"
                />
              </div>
            )}
            {!isSignUp && !isForgotPassword && (
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-purple-600 hover:underline"
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>
            )}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin mr-2" size={20} />
              ) : null}
              {isForgotPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Log In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            {isForgotPassword ? (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-purple-600 hover:underline"
                disabled={loading}
              >
                Back to Login
              </button>
            ) : isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-purple-600 hover:underline"
                  disabled={loading}
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don't have an account yet?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-purple-600 hover:underline"
                  disabled={loading}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}