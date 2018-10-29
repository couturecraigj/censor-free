import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';

const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      img {
        imgUri
      }
    }
    objFeed(id: $id) {
      id
      ... on Photo {
        title
        imgUri
      }
    }
  }
`;

const Product = styled.div`
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

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const Container = styled.div`
  padding: 0 400px;
`;

const SingleProduct = ({ match }) => (
  <div>
    <Helmet>
      <title>Product</title>
    </Helmet>
    <Query query={GET_PRODUCT} variables={match.params}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';

        if (error) return `Error! ${error.message}`;

        const { product, objFeed } = data;

        return (
          <Container name="dog">
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <Product key={product.id} value={product.name}>
              <div>{product.name}</div>
              {product.img &&
                product.img.imgUri && (
                  <img src={product.img.imgUri} alt={product.name} />
                )}
              <div>{product.description}</div>
            </Product>
            <div>
              {objFeed.map(feed => (
                <div key={feed.imgUri}>
                  <Image src={feed.imgUri} />
                </div>
              ))}
            </div>
          </Container>
        );
      }}
    </Query>
  </div>
);

SingleProduct.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default SingleProduct;
