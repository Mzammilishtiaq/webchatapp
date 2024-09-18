// import { useState } from 'react'
import Container from '../../Containers/Container'
import CustomCard from '../../Components/CustomCard'
import { Form, Formik } from 'formik'
import Input from '../../Components/Input'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import * as Yup from 'yup';
import { useFirebase } from '../../Context/Context'
import { useUserStore } from '../../Context/useStore'

function Login() {
    const intialvaluesdata = {
        email: '',
        password: '',
    }

    const FormScheme = Yup.object().shape({
        email: Yup.string().label('Email').required(),
        password: Yup.string().label('Password').required(),
    })
    // const [isLoading, setIsLoading] = useState(false)
    const { signin } = useFirebase();
    const {loading} = useUserStore()

    const handleSubmit = async(values: any) => {
        await signin(values)
    }

    return (
        <Container styleName={'bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% items-center justify-center w-full'}>
            <CustomCard styleClass={'justify-center w-3/12 p-5'}>
                <div className='w-full'>
                    <h1 className='text-left font-sans font-semibold text-xl mb-2'>Login</h1>

                    <Formik initialValues={intialvaluesdata} validationSchema={FormScheme} onSubmit={handleSubmit}>
                        {
                            ({ handleChange, errors, handleBlur, touched, values }) => (
                                <>
                                    <Form className='w-full flex flex-col items-center justify-center gap-4'>
                                        <Input
                                            id="email"
                                            name="email"
                                            label="Email"
                                            labelClassName='flex gap-1'
                                            type="email"
                                            variant="outline"
                                            placeholder="Enter Email ID"
                                            handldChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            error={errors.email}
                                            touched={touched.email}
                                            className='w-full sm:w-full'
                                        />
                                        <Input
                                            name="password"
                                            label="Password"
                                            labelClassName='flex gap-1'
                                            type="password"
                                            placeholder="Enter Password"
                                            variant="outline"
                                            handldChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.password}
                                            touched={touched.password}
                                            value={values.password}
                                            className='w-full'
                                        />
                                        {/* <CustomButton
                                type={'submit'}
                                label='Login'
                                labelClass='text-white font-semibold'
                                styleClass='w-5/6 !rounded-lg px-1 py-2'
                                handleButtonClick={handleSubmit}
                                // handleButtonClick={() => navigate('/user_management')}
                                isLoading={isLoading}
                                /> */}
                                                                            <button
                                                type="submit"
                                                className={`text-white w-full !rounded-lg px-1 py-2 font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500'}`}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <svg
                                                        className="animate-spin h-5 w-5 text-white inline-block mr-2"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                        ></path>
                                                    </svg>
                                                ) : null}
                                                {loading ? 'Signing...' : 'Login'}
                                            </button>
                                        {/* <button type='submit' className='text-white w-full !rounded-lg px-1 py-2 bg-emerald-500 font-semibold' disabled={loading}>Login</button> */}
                                        <Typography variant='body1' component={'div'} className='w-full'>Account is not<Link to={'/signup'}> <div className='text-blue-600 text-sm font-medium inline-flex justify-start'>Signup</div></Link></Typography>
                                    </Form>
                                    {/* <div className='flex items-center gap-4 my-1'>
                                        <div className="line-through border-2 w-full"></div>
                                        <p>
                                            OR
                                        </p>
                                        <div className="line-through border-2 w-full"></div>
                                    </div> */}
                                    {/* <button onClick={handleSubmit} onChange={handleChange} className='text-black boorder-2 w-10/12 !rounded px-1 py-2  font-semibold'>Sign Google</button> */}
                                    {/* <GoogleLoginButton onClick={signInWithGoogle} /> */}

                                </>
                            )
                        }
                    </Formik>
                </div>
            </CustomCard>
        </Container>
    )
}

export default Login
