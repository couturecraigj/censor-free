import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Product as ProductRoute } from '../../Routes';

const GET_PRODUCT_LIST = gql`
  {
    products {
      id
      name
      slug
      description
      img {
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

const ProductList = styled.div`
  padding: 0 400px;
`;

export default () => (
  <div>
    <Helmet>
      <title>Product List</title>
    </Helmet>
    <ProductList>
      <Query query={GET_PRODUCT_LIST}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';

          if (error) return `Error! ${error.message}`;

          return (
            <React.Fragment>
              {data.products.map(product => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}/${product.slug}`}
                  onMouseOver={ProductRoute.load}
                  onFocus={ProductRoute.load}
                >
                  <Product key={product.id} value={product.name}>
                    <div>{product.name}</div>
                    {product.img && product.img.imgUri && (
                      <img src={product.img.imgUri} alt={product.name} />
                    )}
                    <div>{product.description}</div>
                  </Product>
                </Link>
              ))}
            </React.Fragment>
          );
        }}
      </Query>
      <Link to="/product/new">
        <Product>New Product</Product>
      </Link>
    </ProductList>
  </div>
);
