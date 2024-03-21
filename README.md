# RML mapping workbench

## Local development setup

Initialize local development environment variables, networking, and start the database (MongoDB):

```
make dev-dotenv-file
make start-traefik
make start-mongo-dev
```

Finally build and start the app:

```
make build-backend-dev 
make build-frontend-dev 
```

### Troubleshooting

Go to https://mongo.mw.dev.localhost (check Traefik monitor for the right URL)
- Get credentials from `.env`
    - `ME_CONFIG_BASICAUTH_PASSWORD`
    - `ME_CONFIG_BASICAUTH_USERNAME`
- Click on database `mapping_workbench`
    - Click on `users` collection (create if not existing)
    - Import or add `New Document`

        ```json
        {
            "email": "admin@mw.com",
            "hashed_password": "$2b$12$W61JFqnRPjAZueI.JpyUYuClbIo0vTyJLryWUWQqdXV4nZDtWuL9W",
            "is_active": true,
            "is_superuser": false,
            "is_verified": true,
            "oauth_accounts": [],
            "settings": {
                "app": {
                    "settings": {
                        "colorPreset": "purple",
                        "contrast": "high",
                        "direction": "ltr",
                        "layout": "vertical",
                        "navColor": "evident",
                        "paletteMode": "light",
                        "responsiveFontSizes": true,
                        "stretch": false
                    }
                },
                "session": {
                    "project": {
                        "$oid": "6506daf5ae66ab7e0d6a87fb"
                    }
                }
            },
            "name": null
        }
        ```

    - Failing that, register a user w/ the app
        - Change `"is_verified"` to `true`
