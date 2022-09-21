import type { NextPage } from "next";
import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import { useUserContext } from '../context/user.context';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const user = useUserContext()

  if (!user) {
    return <LoginForm />
  }

  return (
    <div>
      <Link href='/posts/new'>
        Create Post</Link>
    </div>
  );
};

export default Home;