drop table gsheet_auth;
drop table credentials;


create table gsheet_auth(
id serial unique primary key,
userName varchar unique,
oAuth2Client  jsonb,
gsheet_auth jsonb
);

create table credentials(
id serial unique primary key,
credentials jsonb
);

INSERT INTO public.credentials
(credentials)
VALUES('{"installed":{"client_id":"35559303380-cd72ajhibb02oi5u7sc470pk1t1t02cc.apps.googleusercontent.com","project_id":"boreal-freedom-214708","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://www.googleapis.com/oauth2/v3/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"4MPr749BMBwH_tScWhQ48CTd","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}');