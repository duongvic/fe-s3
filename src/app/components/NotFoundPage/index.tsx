import { Result, Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function NotFoundPage() {
  const history = useHistory();
  const handleClick = () => {
    history.push('/');
  };
  return (
    <>
      <Result
        style={{ marginTop: '6.5rem' }}
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={handleClick}>
            Back Home
          </Button>
        }
      />
    </>
  );
}
