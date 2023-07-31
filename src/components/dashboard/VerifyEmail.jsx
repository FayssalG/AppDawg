import React from 'react'

export default function VerifyEmail({signOut , resendVerificationEmail}) {
  return (
    <>
    <div>A Confirmation link has been sent to your email</div>
    <button onClick={signOut} >sign out</button>
    <button onClick={resendVerificationEmail} >Resend</button>
    </>
  )
}
