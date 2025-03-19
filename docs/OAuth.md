# OAuth Workflow process with AWS Cognito


## Social Authentication

To enable **Google** and **GitHub** login for your AWS Cognito User Pool, follow these steps:  

---

### **1️⃣ Add Google as an Identity Provider**
#### **Step 1: Create Google OAuth Credentials**
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project or create a new one.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth Client ID**.
5. Choose **Web Application**.
6. Set **Authorized redirect URIs**:
   ```
   https://project-board.auth.ap-southeast-2.amazoncognito.com/oauth2/idpresponse
   ```
7. Click **Create** and **copy** the **Client ID** and **Client Secret**.

#### **Step 2: Add Google as an IdP in Cognito**
Run this command to add Google to Cognito:

```sh
aws cognito-idp create-identity-provider \
    --user-pool-id ap-southeast-2_O0TIDxWzZ \
    --provider-name Facebook \
    --provider-type Facebook \
    --provider-details client_id=223090538927672,client_secret=7c2b98e6731ac29c379a4456b03eefb8,authorize_scopes="profile email openid" \
    --attribute-mapping email=email
    
aws cognito-idp update-identity-provider \
    --user-pool-id ap-southeast-2_O0TIDxWzZ \
    --provider-name Facebook \
    --provider-details client_id=223090538927672,client_secret=7c2b98e6731ac29c379a4456b03eefb8,authorize_scopes="public_profile email" \
    --attribute-mapping email=email

https://web.facebook.com/v21.0/dialog/oauth?client_id=223090538927672&redirect_uri=https%3A%2F%2Fapp-board.auth.ap-southeast-2.amazoncognito.com%2Foauth2%2Fidpresponse&scope=public_profile,email&response_type=code&state=H4sIAAAAAAAAAFVQyXKjMBT8F50NRjabuDHxxHFSNsbBSzw1lXoggcEgAZLXVP49Sm65ddfr5VV_IEABgtaQ4qQODKQyRu-Rlcwm1-19jwYo1edHyFgqxFHTTFNv5FZK0kOFaefRcd5Ir7bTk-CFFlAtOCjVymA4TAX01KA3Do2gqUlP2ZFyaYq-GIJuG2ZQ1ylk37lM2zJBmYb578YCBf8Qa6CsNREt4yVF_wfoqFUPLw7pppG_EVuyskW4kGeRzt02ft5fVm35t4kW_SGKepi_7MP01cLJZpp01Vp4FbduUbe-rZbyKnL6lF2f9q_hxCUlnsV_dmG4TOpYrGVSc6NRu_h9Q-qJw932nif2G3uj0rh4_XoJhaW25f3hJqWzqxZOdKYwVQ7P_clmpi5xMffj6bXYzvXv9c_QrfGzivk9gPl7dxMauAueiYKXSpiZaLSrQQH2bEzGPsHjAWpRkEMt2QB1Ou48wqalRb3GuZN6xPWJgV0ghm0RagBzNKXALMBebrsYfX4BoukdJfABAAA.H4sIAAAAAAAAAGuoVNyo0HM7x9eE72bL6QNWc8_wBercSVHUaPg0-2vSIQEAtY7q_SAAAAA.3&ret=login&fbapp_pres=0&logger_id=04fe5b35-3d8c-479d-a6c2-d3bd2b2cd964&tp=unspecified&cbt=1741938915426&ext=1741942518&hash=AearVS69VxmjP2bpm6g

https://web.facebook.com/v21.0/dialog/oauth?client_id=223090538927672&redirect_uri=https%3A%2F%2Fapp-board.auth.ap-southeast-2.amazoncognito.com%2Foauth2%2Fidpresponse&scope=public_profile%20email%20openid&response_type=code&state=H4sIAAAAAAAAAFVQy3KbMBT9F60N5g1i1-AWUscYj-0kONPJXCSZhwEBAse403-vkl1258w9jzvnLwLkI-gUwaexYCBGxXjfaofH1e3lfkILlMnzLyAs4_wiKZHUNZxqFLSodNq71Dw3wq2tbOJtLgVUCopx7IS_XGYcBqrQuYWG00ylE7nQVqh8yJcg25YE6joD8pnLpI1wyiQ8f2_Mkf-GWANlLQnvWFtS9GeBLlI1c2sfROHW0eD0ex0o-nEX5MfdZUj3xs94imftXEZzV7G4EUmEg4fTa9g6nZuIw8ZaTdekMKprfwMzPG6rNLqfeFhlaX7bbrwKx-v55dEE_vBhdLtBH-gTsaLwKbPnvg1XTsjcILZ2eB_gH9tNTp9tJ8SWCK1XmpLksDZSsN8hs4ukL9vBk7_XX0N3ytcq6ucA6vfdVWjgzlvC87YcuUp4I10N8nXX0rHpOY69QB3yz1ALtkC9jLsauqpJ0SCxZmPwwHAUE4OhWEQDxfM8rOiMYddxDEw9E_37DwEKKyjwAQAA.H4sIAAAAAAAAAAEgAN__e52QdRv0kKAZZg_NC4_ON-H-ztPvPpOHzDoi45hDxQziHK7vIAAAAA.3&ret=login&fbapp_pres=0&logger_id=7d4e3659-fd41-47f8-b11c-4c73715e5ac0&tp=unspecified&cbt=1741938667504&ext=1741942374&hash=AebrhYsh6etZ3phxGJ8

aws cognito-idp create-identity-provider \
    --user-pool-id ap-southeast-2_O0TIDxWzZ \
    --provider-name Facebook \
    --provider-type Facebook \
    --provider-details client_id=223090538927672,client_secret=7c2b98e6731ac29c379a4456b03eefb8,authorize_scopes="public_profile,email,openid" \
    --attribute-mapping email=email

{
    "IdentityProvider": {
        "UserPoolId": "ap-southeast-2_O0TIDxWzZ",
        "ProviderName": "Facebook",
        "ProviderType": "Facebook",
        "ProviderDetails": {
            "attributes_url": "https://graph.facebook.com/v21.0/me?fields=",
            "attributes_url_add_attributes": "true",
            "authorize_scopes": "profile email openid",
            "authorize_url": "https://www.facebook.com/v21.0/dialog/oauth",
            "client_id": "223090538927672",
            "client_secret": "7c2b98e6731ac29c379a4456b03eefb8",
            "token_request_method": "GET",
            "token_url": "https://graph.facebook.com/v21.0/oauth/access_token"
        },
        "AttributeMapping": {
            "email": "email",
            "name": "name",
            "username": "id"
        },
        "LastModifiedDate": "2025-03-14T15:38:13.759000+08:00",
        "CreationDate": "2025-03-14T15:38:13.759000+08:00"
    }
}


```

---

### **2️⃣ Add GitHub as an Identity Provider**
#### **Step 1: Create GitHub OAuth App**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Set:
   - **Homepage URL**: `https://project-board.auth.ap-southeast-2.amazoncognito.com`
   - **Authorization callback URL**:
     ```
     https://project-board.auth.ap-southeast-2.amazoncognito.com/oauth2/idpresponse
     ```
4. Click **Register application**.
5. Copy the **Client ID** and **Client Secret**.

#### **Step 2: Add GitHub as an IdP in Cognito**
Run this command to add GitHub to Cognito:

```sh
aws cognito-idp create-identity-provider \
    --user-pool-id ap-southeast-2_O0TIDxWzZ \
    --provider-name GitHub \
    --provider-type OIDC \
    --provider-details client_id=GITHUB_CLIENT_ID,client_secret=GITHUB_CLIENT_SECRET,authorize_scopes="openid user:email",oidc_issuer="https://github.com/login/oauth",attributes_request_method="GET" \
    --attribute-mapping email=email



```

---

### **3️⃣ Enable Social Logins in Cognito App Client**
Update your Cognito App Client to allow Google and GitHub:

```sh
aws cognito-idp update-user-pool-client \
    --user-pool-id ap-southeast-2_O0TIDxWzZ \
    --client-id 7r3elbbg1nc77n9g84nuh0fdhm \
    --supported-identity-providers COGNITO Google GitHub \
    --allowed-o-auth-flows code implicit \
    --allowed-o-auth-scopes openid email profile \
    --allowed-o-auth-flows-user-pool-client
```

---

### **4️⃣ Test Social Login**
Now, test the login with Google or GitHub:

```
https://project-board.auth.ap-southeast-2.amazoncognito.com/login?client_id=7r3elbbg1nc77n9g84nuh0fdhm&response_type=code&scope=email+openid+profile&redirect_uri=http://localhost:5000/auth/callback
```

You should see **Google and GitHub** as login options! 🎉  

---

### 🚀 **Let me know if you hit any issues!**
