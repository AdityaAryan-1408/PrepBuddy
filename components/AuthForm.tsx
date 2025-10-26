"use client"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from './ui/button'
import { Form } from './ui/form'
import { toast } from 'sonner'
import FormField from './FormField'
import { signUp, signIn } from '@/lib/actions/auth.action'


const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}


export const AuthForm = ({ type }: { type: FormType }) => {

    const router = useRouter();
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === 'sign-up') {
                const { name, email, password } = values;
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                }

                toast.success('Account Created Successfully. Please sign-in')
                router.push('/sign-in');
                console.log('SIGN UP', values);

            } else {

                const { email, password } = values;
                const userCredentials = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredentials.user.getIdToken();
                if (!idToken) {
                    toast.error('Something went wrong');
                    return;
                }

                await signIn({
                    email, idToken
                })

                toast.success('Signed-in successfully')
                router.push('/');
                console.log('SIGN IN', values);
            }
        } catch (error) {
            console.log(error);
            toast.error(`Something went wrong ${error}}`);
        }
    }

    const isSignIn = type === 'sign-in';
    return (
        <div className='card-border  lg: min-2-[566px]'>
            <div className='flex flex-col gap-6 card py-14 px-10'>
                <div className='flex flex-row gap-2 justify-center'>
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        width={38}
                        height={32}
                    />
                    <h2 className='text-primary-100'>PrepBuddy</h2>
                </div>
                <h3>Practice Job interviews with AI</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 mt-4 form">
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder='Your Name'
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder='Your Email'
                            type='email'
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder='Your Password'
                            type='password'
                        />
                        <Button className='btn' type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</Button>
                    </form>
                </Form>
                <p className='text-center'>
                    {isSignIn ? 'No Account Yet?' : 'Have an account already?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className='font-bold text-user-primary ml-1' >
                        {isSignIn ? 'Sign Up' : 'Sign In'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
