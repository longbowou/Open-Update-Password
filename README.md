# Open Update Password Lambda

This AWS Lambda function provides a secure mechanism for users to update their password. It integrates DynamoDB to store
user data and bcrypt for secure password hashing and validation. Here's how the function works and why it’s important:

## Key Highlights

- **Password Validation with Bcrypt**:
  The function ensures that users provide their current password before allowing them to set a new one. Using bcrypt, it
  compares the current password with the hashed password stored in the system, preventing unauthorized password changes.

- **Secure Password Update**:
  After validating the current password, the function hashes the new password using bcrypt and securely stores it in
  DynamoDB, ensuring that the system continues to protect user credentials with encryption.

- **Real-Time Feedback**:
  Users are given immediate feedback if the current password is incorrect or if any required fields are missing. This
  improves user experience and security by preventing weak password changes.

## How It Works

- **Input Validation**:
  The function first checks if both the currentPassword and password fields are provided in the request. If either field
  is missing, a 400 error is returned, guiding users to provide all necessary information.

- **Password Comparison**:
  The current password provided by the user is compared against the stored password using bcrypt. If the passwords don’t
  match, an error is returned informing the user that the current password is incorrect.

- **DynamoDB Update**:
  Once the current password is validated, the function hashes the new password using bcrypt, then updates the user's
  record in DynamoDB by replacing the old password with the new one. The update is executed using the UpdateItemCommand
  in DynamoDB.

## Why This Lambda is Awesome

This function combines security and ease of use, allowing users to securely update their passwords while ensuring that
their current password is valid. By utilizing bcrypt for password hashing and DynamoDB for storage, this Lambda function
helps protect user data from unauthorized access. It’s an essential part of any modern, security-focused application,
ensuring that password management is handled with care and precision.






