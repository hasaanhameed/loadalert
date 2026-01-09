import bcrypt

class Hash():
    @staticmethod
    def bcrypt(password: str):
        # Generate a salt and hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')  # Return the hashed password as a string

    @staticmethod
    def verify(plain_password: str, hashed_password: str):
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )