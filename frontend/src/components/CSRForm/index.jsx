import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const validationSchema = Yup.object().shape({
  commonName: Yup.string().required('Required'),
  organization: Yup.string().required('Required'),
  country: Yup.string().required('Required').max(2, '2-letter code'),
  state: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required')
});

const CSRForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        commonName: '',
        organization: '',
        country: '',
        state: '',
        city: '',
        email: ''
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="commonName">
            {({ field }) => (
              <TextField
                {...field}
                label="Common Name"
                fullWidth
                margin="normal"
                error={!!ErrorMessage}
                helperText={<ErrorMessage name="commonName" />}
              />
            )}
          </Field>

          {/* Repeat for other fields */}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            fullWidth
          >
            Submit CSR Request
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CSRForm;