import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Group as GroupRoute } from '../../Routes';

const GET_GROUP_LIST = gql`
  {
    groups {
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

const GroupList = styled.div`
  padding: 0 400px;
`;

export default () => (
  <div>
    <Helmet>
      <title>Group List</title>
    </Helmet>
    <GroupList name="dog">
      <Query query={GET_GROUP_LIST}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';

          if (error) return `Error! ${error.message}`;

          return (
            <React.Fragment>
              {data.groups.map(group => (
                <Link
                  key={group.id}
                  onMouseOver={GroupRoute.load}
                  onFocus={GroupRoute.load}
                  to={`/group/${group.id}/${group.title}`}
                >
                  <Group key={group.id} value={group.title}>
                    <div>{group.title}</div>
                    {group.img && group.img.imgUri && (
                      <img src={group.img.imgUri} alt={group.title} />
                    )}
                    <div>{group.description}</div>
                  </Group>
                </Link>
              ))}
            </React.Fragment>
          );
        }}
      </Query>
      <Group>
        <Link to="/group/new">New Group</Link>
      </Group>
    </GroupList>
  </div>
);
