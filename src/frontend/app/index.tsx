import { withAuth } from '@/utils/withAuth';
import { Redirect } from 'expo-router';

function Index() {
  return <Redirect href='/home' />;
}

export default withAuth(Index);
