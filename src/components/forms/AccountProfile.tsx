'use client';

export type UserInfoFromDB = {
    _id: string
    objectId: string
    username: string
    name: string
    bio: string
    image: string
};

type accountProfileProps = {
    user: UserInfoFromDB,
    btnTitle: string
};

function AccountProfile({ user, btnTitle }:
    accountProfileProps
) {
    return (
        <div>
            Account Profile
        </div>
    );
}

export default AccountProfile;
