import React from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './UserButton.module.css';
import { useRouter } from 'next/navigation';

export function UserButton({ user }) {

  const router = useRouter();

  return (
    <div className={classes.user}
      onClick={() => router.push('/user/profile')}
    >
      <div>
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/${user.avatar}`}
          alt={user.name}
          style={{ borderRadius: '50%' }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: 'small' }}>
            {user.name}
          </div>

          <div style={{ color: 'dimmed', fontSize: 'x-small' }}>
            {user.email}
          </div>
        </div>

        <IconChevronRight style={{ width: 14, height: 14 }} stroke={1.5} />
      </div>
    </div>
  );
}