import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import H1 from '@/components/typography/h1';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/loader/Loader.style';
import callApiWrapper from '@/components/wrappers/CallApiWrapper';
import { setUserContext } from '@/store/reducers/user-context';
import FormField from '../form-field';
import { Form } from '@/components/ui/form';
import { signup } from '../auth.service';
import { IRegisterUserReq } from 'chat-app.contracts';

const formSchema = yup.object().shape({
  fullname: yup.string().required('Please enter your Full Name'),
  /**
   * Only contains alphanumeric characters, underscore and dot.
   * Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).
   * Underscore and dot can't be next to each other (e.g user_.name).
   * Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).
   * Number of characters must be between 6 to 24.
   */
  username: yup
    .string()
    .required('Please enter your Username.')
    .matches(/^(?=[a-zA-Z0-9._]{6,24}$)(?!.*[_.]{2})[^_.].*[^_.]$/),
  email: yup.string().email().required('Please enter your valid Email.'),
  /**
   * Password must contain one digit from 0 to 9
   * one lowercase letter, 
   * one uppercase letter, 
   * no space
   * it must be 8-24 characters long. 
   * Usage of special character is optional.
   */
  password: yup
    .string()
    .required('Please enter Password for your account.')
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,24}$/, 
      { 
        message: 'Password must contain one digit from 0 to 9, one lowercase letter, one uppercase letter, no space, and it must be 8-24 characters long. Usage of special character is optional.' 
      }
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords dont match!')
    .required('Please enter confirmation password, it should matched with Password field.')
});

export default function SignUp(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const form = useForm<IRegisterUserReq>({
    resolver: yupResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = callApiWrapper(async (values) => {
    const data = await signup(values);
    dispatch(setUserContext(data));
    navigate('/');
  }, setLoading, navigate);

  return (
    <Form {...form}>
      <form 
        className="relative w-full flex flex-col items-center justify-center gap-4 md:w-[450px] p-8"
        onSubmit={form.handleSubmit(onSubmit)} 
      >
        <H1 className="mb-8">Sign Up</H1>

        <FormField 
          name="fullname" 
          form={form} 
          Component={Input} 
          componentProps={{
            placeholder: 'Full name' 
          }}
        />
        <FormField 
          name="username" 
          form={form} 
          Component={Input} 
          componentProps={{
            placeholder: 'Username' 
          }}
        />
        <FormField 
          name="email" 
          form={form} 
          Component={Input} 
          componentProps={{ 
            type: 'email',
            placeholder: 'Email' 
          }}
        />
        <FormField 
          name="password" 
          form={form} 
          Component={Input} 
          componentProps={{ 
            type: 'password',
            placeholder: 'Password' 
          }}
        />
        <FormField 
          name="confirmPassword" 
          form={form} 
          Component={Input} 
          componentProps={{ 
            type: 'password',
            placeholder: 'Confirmation password'  
          }} 
        />

        <Button
          type="submit"
          className="w-full inline-block rounded bg-[#e84393] text-sm font-medium uppercase leading-normal text-white font-bold my-4 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        >
          Sign up
        </Button>

        <Label>
          Already have account? 
          <Link to="/auth/signin" className="text-[#00cec9] font-bold ml-2">Sign In</Link>
        </Label>

        {/* Divider */}
        <div className="w-full flex items-center my-4 before:border-2 before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:border-2 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="text-center font-semibold dark:text-neutral-200 mx-4">
            OR
          </p>
        </div>

        <Link
          className="w-full flex items-center justify-center rounded bg-[#dfe6e9] px-7 pb-2.5 pt-3 text-center text-[#2d3436] text-sm font-bold uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          to="/auth/signin"
          role="button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mr-2 h-4 w-4"
            viewBox="0 0 48 48"
          >
            <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Continue with Google
        </Link>

        {loading && ( <Loader withOverlay overlayColor="#00000055"/> )}
      </form>
    </Form>
  );
}
