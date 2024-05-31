import * as Yup from 'yup';
import {useFormik} from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {GuestGuard} from 'src/guards/guest-guard';
import {IssuerGuard} from 'src/guards/issuer-guard';
import {useAuth} from 'src/hooks/use-auth';
import {useMounted} from 'src/hooks/use-mounted';
import {usePageView} from 'src/hooks/use-page-view';
import {useRouter} from 'src/hooks/use-router';
import {useSearchParams} from 'src/hooks/use-search-params';
import {Layout as AuthLayout} from 'src/layouts/auth/classic-layout';
import {paths} from 'src/paths';
import {Issuer} from 'src/utils/auth';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {signIn, signOut, useSession} from 'next-auth/react';
import GoogleIcon from '@mui/icons-material/Google';
import Divider from "@mui/material/Divider";


const initialValues = {
    username: '',
    password: '',
    remember_me: true,
    submit: null
};

const validationSchema = Yup.object({
    username: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Username is required'),
    password: Yup
        .string()
        .max(255)
        .required('Password is required')
});

const Page = () => {
    const isMounted = useMounted();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');
    const {issuer, signIn: singInJWT} = useAuth();
    // const {data: session} = useSession()

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers) => {
            try {
                await singInJWT(values.username, values.password, values.remember_me);

                if (isMounted()) {
                    router.push(returnTo || paths.app.index);
                }
            } catch (err) {
                console.error(err);
                if (isMounted()) {
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    helpers.setSubmitting(false);
                }
            }
        }
    });

    usePageView();

    return (
        <>
            <Seo title="Login"/>
            <div>
                <Card elevation={16}>
                    <CardHeader
                        subheader={(
                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                Don&apos;t have an account?
                                &nbsp;
                                <Link
                                    component={RouterLink}
                                    href={paths.auth.jwt.register}
                                    underline="hover"
                                    variant="subtitle2"
                                >
                                    Register
                                </Link>
                            </Typography>
                        )}
                        sx={{pb: 0}}
                        title="Log in"
                    />
                    <CardContent>
                        <form
                            noValidate
                            onSubmit={formik.handleSubmit}
                        >
                            <Stack spacing={3}>
                                <TextField
                                    autoFocus
                                    error={!!(formik.touched.username && formik.errors.username)}
                                    fullWidth
                                    helperText={formik.touched.username && formik.errors.username}
                                    label="Username"
                                    name="username"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="email"
                                    value={formik.values.username}
                                />
                                <TextField
                                    error={!!(formik.touched.password && formik.errors.password)}
                                    fullWidth
                                    helperText={formik.touched.password && formik.errors.password}
                                    label="Password"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.password}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.remember_me}
                                            onChange={formik.handleChange}
                                            inputProps={{'aria-label': 'controlled checkbox'}}
                                            name="remember_me"
                                        />
                                    }
                                    label="Remember me (for 24 hours)"
                                />
                            </Stack>
                            {formik.errors.submit && (
                                <FormHelperText
                                    error
                                    sx={{mt: 3}}
                                >
                                    {formik.errors.submit}
                                </FormHelperText>
                            )}
                            <Stack gap={3}>
                                <Button
                                    disabled={formik.isSubmitting}
                                    fullWidth
                                    size="large"
                                    sx={{mt: 2}}
                                    type="submit"
                                    variant="contained"
                                >
                                    Log In
                                </Button>
                                {/*<Divider>or</Divider>*/}
                                {/*{session?.user?.email ?*/}
                                {/*    <Button fullWidth*/}
                                {/*            startIcon={<GoogleIcon/>}*/}
                                {/*            onClick={() => signOut()}>*/}
                                {/*        Sign Out*/}
                                {/*    </Button> :*/}
                                {/*    <Button fullWidth*/}
                                {/*            startIcon={<GoogleIcon/>}*/}
                                {/*            onClick={() => signIn('google')}>*/}
                                {/*        Sign in with Google*/}
                                {/*    </Button>}*/}
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
                {/*<Stack*/}
                {/*    spacing={3}*/}
                {/*    sx={{mt: 3}}*/}
                {/*>*/}
                {/*    <Alert severity="error">*/}
                {/*        <div>*/}
                {/*            You can use <b>{user.username}</b> and password <b>{user.password}</b>*/}
                {/*        </div>*/}
                {/*    </Alert>*/}
                {/*</Stack>*/}
            </div>
        </>
    );
};

Page.getLayout = (page) => (
    <IssuerGuard issuer={Issuer.JWT}>
        <GuestGuard>
            <AuthLayout>
                {page}
            </AuthLayout>
        </GuestGuard>
    </IssuerGuard>
);

export default Page;
