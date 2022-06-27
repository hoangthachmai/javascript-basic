import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import useScriptRef from '../../hooks/useScriptRef';

const JWTLogin = ({ className, ...rest }) => {
  const { login } = useAuth();
  const scriptedRef = useScriptRef();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        company: 'HNN',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Email chưa đúng định dạng').max(255).required('Email bắt buộc'),
        password: Yup.string().max(255).required('Mật khẩu bắt buộc'),
        company: Yup.string().max(255).required('Tên công ty bắt buộc'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await login(values.email, values.password);

          if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} className={clsx(className)} {...rest}>
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            autoFocus
            helperText={touched.email && errors.email}
            label="Email"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Mật khẩu"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Đăng nhập
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
