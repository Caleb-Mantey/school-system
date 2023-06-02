### Login Request

    POST /login


This API endpoint should allow the student to login using their registered email address and password.

#### Body
    {
      "email": "test@email.com",
      "password": "secret"
    }

#### Responses
##### 200 (OK)

    {
      "message": "Logged in successfully!",
      "data": {
        "id": "GT-162912-1212",
        "name": "Philip Boahen",
        "email": "example@email.com",
        "phone": "0263257625",
        "settings": {
          "notifications": {
            "push": true,
            "email": true,
            "sms": false
          },
          "links": [
	         {
		         "name": "About",
		         "link": "https://#"
	         },
	         {
		         "name": "Terms & Conditions",
		         "link": "https://#"
	         },
	         {
		         "name": "Privacy Policy",
		         "link": "https://#"
	         } 
          ]
        }
      }
    }
##### 401 (Unauthorized)

    {
      "message": "Invalid email or password."
    }

### Password Reset Request

    POST /password/reset/request

This API endpoint should allow the student to make a password reset request using their registered email.  A unique otp should be sent to their email addess for account verification.

#### Body

    {
      "email": "example@email.com"
    }

#### Responses
##### 200 (OK)

    {
      "email": "OTP has been sent to your registered email, please copy the code and paste the field below."
    }

### Password Reset

    POST /password/reset

This API endpoint should allow the student to change their old password.

#### Body

    {
      "new_password": "xxxxxx",
      "password_confirmation": "xxxxxx"
    }
    
#### Responses
##### 200 (OK)

    {
      "message": "Password has been reset successfully!"
    }

### Courses

    GET /courses/registered

This API endpoint should return a list of courses a student registered to the student's id. 

#### Responses
##### 200 (OK)

    [
      {
        "id": 1,
        "name": "Financial Account"
      },
      {
        "id": 2,
        "name": "Economics"
      }
    ]

...

    PATCH /courses/registered/{id}

This API endpoint should associate a student with a course.

#### Body

    {}

#### Responses
##### 200 (OK)

    {
      "message": "Course registered successfully."
    }

...

    DELETE /courses/registered/{id}

This API endpoint should disassociate a student from a course.
#### Body

    {}

#### Responses
##### 200 (OK)

    {
      "message": "Course deregistered successfully."
    }


### Attendance

    POST /attendance

This API endpoint should allow a student to clock-in.

#### Body

    {}

#### Reponses
##### 200 (OK)

    {
      "message": "Student has clocked-in successfully.",
      "id": 1
    }
...

    PATCH /attendance/{id}

This API endpoint should allow a user to clock-out.

#### Body

    {}
    
#### Responses
##### 200 (OK)

    {
      "message": "Student has clocked-out successfully."
    }

...

    GET /attendance/{id}

This API endpoint should return a list of attendance records.

#### Body

    {
      "limit": 10 //optional
    }

#### Responses
##### 200 (OK)

    [
      {
        "id": 1,
        "date": "2023-01-01",
        "course": "Economics",
        "lecturer": "Mr. Kobby Asante",
        "clocked_in_at": "14:00:56",
        "clocked_out_at": "14:50:00"
      },
      {
        "id": 2,
        "date": "2023-01-01",
        "course": "Accounting",
        "lecturer": "Mrs. Kobby Asantewaa",
        "clocked_in_at": "14:00:56",
        "clocked_out_at": "14:50:00"
      }
    ]

### Courses

    GET /courses

This API endpoint should return a list of courses related to a student's program. 

#### Responses
##### 200 (OK)

    [
      {
        "id": 1,
        "name": "Financial Account",
        "registered": false
      },
      {
        "id": 2,
        "name": "Economics",
        "registered": true
      }
    ]
