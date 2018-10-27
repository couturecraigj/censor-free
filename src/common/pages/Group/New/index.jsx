import React from 'react';
// import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Formik, Form } from 'formik';
import { FormikFileUpload } from '../../../components/FileUpload';
import { FormikTextInput } from '../../../components/TextInput';
import { FormikTextArea } from '../../../components/TextArea';
import DebugField from '../../../components/FormDebug';

const ADD_GROUP = gql`
  mutation AddGroup($title: String!, $description: String, $imgUri: String!) {
    addGroup(title: $title, description: $description, imgUri: $imgUri) {
      id
      title
      description
      img {
        imgUri
      }
    }
  }
`;

const Group = styled.div`
  width: 100%;
  background: white;
  padding: 8px;
  border-radius: 2px;
  margin: 10px;
  & img {
    width: 100%;
    height: auto;
  }
`;

const Container = styled.div`
  padding: 0 400px;
`;

const validationSchema = Yup.object().shape({
  title: Yup.string().required('You must give it a name'),
  description: Yup.string().required(
    'You need to provide at least a little description'
  ),
  imgUri: Yup.string().required(
    'You need to have an image uploaded before continuing'
  )
});

const GroupNew = () => (
  <div>
    <Helmet>
      <title>New Group</title>
    </Helmet>
    <Mutation mutation={ADD_GROUP}>
      {addGroup => {
        return (
          <Container>
            <Group>
              <Formik
                validationSchema={validationSchema}
                onSubmit={variables =>
                  addGroup({ variables }).then(
                    ({ data }) =>
                      (location.href = `/group/${data.addGroup.id}/${
                        data.addGroup.name
                      }`)
                  )
                }
              >
                {() => (
                  <Form>
                    <FormikFileUpload
                      name="imgUri"
                      label="Group Image Upload"
                      accept="image/*"
                      id="imgUri"
                    />
                    <FormikTextInput name="title" id="title" label="Title" />
                    <FormikTextArea
                      name="description"
                      id="description"
                      label="Description"
                    />
                    <button type="submit">Submit</button>
                    <DebugField />
                  </Form>
                )}
              </Formik>
            </Group>
          </Container>
        );
      }}
    </Mutation>
  </div>
);

GroupNew.propTypes = {
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string.isRequired
  //   })
  // }).isRequired
};

export default GroupNew;
