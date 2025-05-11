--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: csr_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.csr_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    domain character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    division character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    country character varying(10) NOT NULL,
    email character varying(255) NOT NULL,
    root_length integer NOT NULL,
    csr text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying
);


ALTER TABLE public.csr_requests OWNER TO postgres;

--
-- Name: csr_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.csr_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.csr_requests_id_seq OWNER TO postgres;

--
-- Name: csr_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.csr_requests_id_seq OWNED BY public.csr_requests.id;


--
-- Name: issued_certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issued_certificates (
    id integer NOT NULL,
    user_id integer,
    csr_id integer,
    domain character varying(255) NOT NULL,
    certificate text NOT NULL,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    valid_till timestamp without time zone
);


ALTER TABLE public.issued_certificates OWNER TO postgres;

--
-- Name: issued_certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.issued_certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.issued_certificates_id_seq OWNER TO postgres;

--
-- Name: issued_certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.issued_certificates_id_seq OWNED BY public.issued_certificates.id;


--
-- Name: revoked_certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.revoked_certificates (
    id integer NOT NULL,
    certificate_id integer NOT NULL,
    revoked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reason text
);


ALTER TABLE public.revoked_certificates OWNER TO postgres;

--
-- Name: revoked_certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.revoked_certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.revoked_certificates_id_seq OWNER TO postgres;

--
-- Name: revoked_certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.revoked_certificates_id_seq OWNED BY public.revoked_certificates.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'client'::character varying,
    is_verified boolean DEFAULT false,
    otp character varying(6),
    otp_expiry timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: csr_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csr_requests ALTER COLUMN id SET DEFAULT nextval('public.csr_requests_id_seq'::regclass);


--
-- Name: issued_certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issued_certificates ALTER COLUMN id SET DEFAULT nextval('public.issued_certificates_id_seq'::regclass);


--
-- Name: revoked_certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revoked_certificates ALTER COLUMN id SET DEFAULT nextval('public.revoked_certificates_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: csr_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.csr_requests (id, user_id, domain, company, division, city, state, country, email, root_length, csr, created_at, status) FROM stdin;
1	3	www.caauth.com	IIT Ropar	IT 	Rupnagar	Punjab	IN	caservice2025@gmail.com	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC2jCCAcICAQAwgZQxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlJSVQgUm9wYXIxDDAKBgNVBAsMA0lU\nIDEXMBUGA1UEAwwOd3d3LmNhYXV0aC5jb20xJjAkBgkqhkiG9w0BCQEWF2Nhc2Vy\ndmljZTIwMjVAZ21haWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\nAQEAypF3+dqFhUd9Q5YOhJ/X9mKbbsCgP+xUM1wKnMp+fFrEXEOZByD0WqrBlgX/\ncJ8KuKqJ+S6JEfmywK+ILAR8aFgqptWV6qvPuyeJF/WVdiUvKQpRKfxn6bnb2Zeb\nYYzwF8f6m5L8Mz1OgIhz/5slnqc7wAosTdfEG0qMBtmHcvGa7n2eiQWS+xpylbNy\nGHKEzg0jq9rz/DIsdR762R721CQM4c/v5ATd2UjWdRN9rIyQkdvFTz3w7MOWzVRb\nhlVQp6cPlF2VEPOeQ0TUjxwNQ478pf5aHkrgy5/yqqD7qXwDJK/uTCRwar6Zc3s9\nwSFays5LGa1reJMlDPU0a7GtBQIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAH9N\nX8zPtfgHq/pMGgDi/zjHrOLS61O7NLmHVil82XBY68cT1hgQ9pwIozI89xm1DZAg\nqRQj2FTdAeXFsViMCBL+Ib0jQXAthLS92577Jj5xnnyUiFefbOkNdsB865GRpQ9g\nerGM6/HQX0BC+nqZghl77UV/nWuL7KvZmv3P6Ng8g1Tpn+C+r8wKgglY9jBr98mw\nbHMTnUjh0vzDbDP0tHTBS2dg4eL94Oc5pVmQoqVqlVgspC22sRZZIg7DZvVQNEGy\n0sDhXf9diCoSPMPcPOLZ1D01+KsTYDqccCBvSGIH/DW7o5MCxyn/tNs3Gxp7ZbqI\nXnJsn50rPVI0wk0I6kI=\n-----END CERTIFICATE REQUEST-----\n	2025-03-25 09:30:43.181383	pending
5	3	www.caauth.com	IIT Ropar	IT 	Rupnagar	Punjab	IN	caservice2025@gmail.com	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC2jCCAcICAQAwgZQxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlJSVQgUm9wYXIxDDAKBgNVBAsMA0lU\nIDEXMBUGA1UEAwwOd3d3LmNhYXV0aC5jb20xJjAkBgkqhkiG9w0BCQEWF2Nhc2Vy\ndmljZTIwMjVAZ21haWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\nAQEAt0ar4TRlmg7wXcs3FPFHZajIQmgvjrSfwtFWN8oCYULoMZZX1aOEC+cTgwkZ\ncZ0OOJQt1jST/aDUbjPV9F9yicRWNT/yCVrQ5VeyK+xQJ5MzfTktUUfXdNQl+roW\nyvWAbswDldzYhSkdzXUTkZhKpcxhtlxF4snUnsr7Ncbf0Z9fOP9qCAH+kWnbbEQY\niF9wjqvgNpY7yFldgvwjpNV8q/IKn4S2+hluOIbGLTxzofm+GzAFM75v6E35p0E8\nUHnj2HjNIzyoefKtbat8MF4NotP7s3djMr9uJ8KsOjJ/+wG0YATzSz67rls22TtP\nyZUeO5zWyH+HmaRUox1ZFfJmSQIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBADud\nYWNwGP3LnyEuPP3LzWG6I1cw+Xqyg7aER6OHADecS7DbGlfavIkQonVWvxqYOcp0\nclY8jWFjBaO6YGVis3JBI88GghBAvKFX+Sa+JCm5dVCZUYHyjUMfgMFWf97GHtvq\nkjLepYtLJcAdYaNJ4lWUXlNzt+hBrcYisRQeYRGweuSu6x8CjH2hZewRPuhEnJ8B\ngrrFDPh00PJKaDEOLJtHNoIsjGeCmlwJBVOu2qECo7gP+lrI+4FIkOVJBQ/L0i7W\nx8u1wlkW+XiEO58p3IsLKvrWAbDN/QoNx1Lt4jVv1HFLooUD5eTV918Nye5z46lN\nnoBBw0OpjC5W8yqFCm4=\n-----END CERTIFICATE REQUEST-----\n	2025-03-25 10:57:28.140571	pending
6	3	www.caauth.com	IIT Ropar	IT 	Rupnagar	Punjab	IN	caservice2025@gmail.com	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC2jCCAcICAQAwgZQxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlJSVQgUm9wYXIxDDAKBgNVBAsMA0lU\nIDEXMBUGA1UEAwwOd3d3LmNhYXV0aC5jb20xJjAkBgkqhkiG9w0BCQEWF2Nhc2Vy\ndmljZTIwMjVAZ21haWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\nAQEA1hFbqaRL/RYsxhFZI41Fg0wYGEtdfwl+Wv00YCH7Ubj8fli4TAD3hFBUGg8r\nfU/ufiaUWocZK7z2FCugLi+unFSE9Vijg0YdNoS/a6/ZAVsc+U4UK3yU9KNIja//\ns2X7VqAvPptcQrHN2t6XeAg2ghvCIUBo5H+m+JVgZ5L3QcRZ1NOUXBEobUAok7jG\nALSbq+7MtR5OWPHDru2C7O/1jtk8MkP0XFrF9KCCgnhflOiP1qxerx/r9wMbZ8E0\n0qeyNgF+CAJyMat7KJFIaoTAO4Ie4ORAHqWgh2pJ1Jsf0oUOyF3sHiP3rvkBeLAb\nBoFMFJtA78ZVTFAX+QdIenu9kwIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAJy5\nfbZpUR1R27feddgEi9mCK5StH+l5mXsRCvJ3Fj1d0ZfTO+q7KpkXUQuhQteNkAxW\niVxtUmh+hCDetCdDy7P04j2+njUiwiMGxi6DR0eFtR4NGz6tMqGebW07D1NYK6a5\nzUYwV8imzihHxMu3WT4LIOUpMb9gDMGyETjtV6rxpRu/Z7pVt5jnE+h6kN7UpxTD\nZUnIzLG12EZ/ocw6/1wRziuNia7gqsq8d5cNGFkly36eKQQnQ5jS0E/9AkfjD7he\ne36eRX8GwL5/MwTdGWN8eL/K1W4HLx9kbUdgqh5Ygi0zOIuA5iHgqjCgv9+R6Nol\nUatsaFUaEcjX31OA86g=\n-----END CERTIFICATE REQUEST-----\n	2025-03-25 11:07:08.003458	pending
8	3	www.caauth.com	IIT Ropar	IT 	Rupnagar	Punjab	IN	agarwalyash0707@gmail.com	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC3DCCAcQCAQAwgZYxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlJSVQgUm9wYXIxDDAKBgNVBAsMA0lU\nIDEXMBUGA1UEAwwOd3d3LmNhYXV0aC5jb20xKDAmBgkqhkiG9w0BCQEWGWFnYXJ3\nYWx5YXNoMDcwN0BnbWFpbC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK\nAoIBAQDKH5FpxMxQxxOW0q5/erupZhuuRJs30f26C6a9z/VlQKAkr6Gc4KMnvAXm\nPXL2bxWAiTlOMxQgATPgYTlWlMUnPnF3mgTv1i1YYkMd8bC3zjnGzGhx9NdvQ4Fi\nbl+rp6Z4ck6ctBRfbCIIH+0plbRTDmCNkEGzuvrjFRgDHIWpxrlONskq3+rJ8w0D\nvxnQ7qggjJGPgYsDlwUHQsqb5u5w3x3tkDg7vd7AGCi1bkDj+KBrQyo7X3llL2MV\nJzFdst3f9XtN3vip4KI/Anr9GmXICMIsQsGQFjl0ry5jheHu3370hkMUMkYyWZhI\nFwCRMDdCTO7r6osNtXXVJKdvWF5HAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEA\nyYLtwoF2DDX5N9I7vJjXmnbIHly52EphnEvFZQpEmRyRKefBbfMrUx5sYNR1Yf2E\n5RKZhVyvaaOJv33sE9RQUPz5EhL9W3j4iT/GyNQ00HC9PhBPI5Nyg5QrZokkot1l\neXFngdarCbVpn41QJ25/yPbAxz2pp6J6+Em0Jt8jSE/bBt6AOhFWal7Tsd0q6yPd\nKT9nU/nbUY6nFJvZKVeREOAPc8uUT9yDqUUPFSmpwedzK+r2qAdW0GOWfQLrNTZK\nR7KOj2tSMnt5i5gSnDZV0pj5b/15euymMdq5nBhlZED2vbhrqNgxhPLbKvSsj+UD\n7+PZc8lGb5Og9vpmOcLpZw==\n-----END CERTIFICATE REQUEST-----\n	2025-04-13 20:34:36.89816	pending
7	3	www.caauth.com	IIT Ropar	IT 	Rupnagar	Punjab	IN	caservice2025@gmail.com	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC2jCCAcICAQAwgZQxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlJSVQgUm9wYXIxDDAKBgNVBAsMA0lU\nIDEXMBUGA1UEAwwOd3d3LmNhYXV0aC5jb20xJjAkBgkqhkiG9w0BCQEWF2Nhc2Vy\ndmljZTIwMjVAZ21haWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\nAQEAnj13LCUkQ9OjKOiQLkxeSY/SmCAE37XkJEXVw+D/DaJiySkvsOtyHvAn+V9G\nOl3JUL+61VuizoJeQh5iwwYLswPGi7e44Q6Beabw1x1/oMf4d+sApF8TFUou7Zuo\nbmhUmZW5mX8Nbp4AGD2p1C5cRMLAxxYQmI2lxhGvAA6l+oOVHI3edO7ZgNkh/Mk4\nwkxjvm/FQsAdp0wzUl0DZ5MWzMNjtiYZBbeiEb7cHJaCqGzX0TU+5sHeKBClP71h\nZaTMEcrrMppfOUp9d6VadtnYDsqwffhsBoBSpjdUBuJd2DznjmNK3NE2Y53HCJMP\nZqVyDRInnS0DMCDrnsM7ng8e+QIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBACaj\n1zmz/yUyAIh2kQ6V2XpZs9zXbqhXzQ0jKd0+m5QXhNujtY3enc/uuH2is49vl9Mx\nLVFe6LE9Ae0+mZ2/XxINhICXHefHzzEkBdr/Sy1FwPdhGzyRyEsJz/H5/l48IFtF\njTtllAFWZADVeAX2WgOqjZZbFFbhNCTtlRtGgshfJM56v/7FtgvhZffMu1R1DVEd\n0vAuok8XcoyfkwWzKr21VsyxXtS+Y0/7TzdWg9+jPPW9hR0TJrD3RSAiYA0fzEvp\nYwRQQG2XuHQpRPQD73Zbh2UuzepMOCNTgXCKMhU/yWChNBB1Xw8NlFdqFaUmXWwQ\nM7JDJfoofcnlgPZC1e8=\n-----END CERTIFICATE REQUEST-----\n	2025-03-25 12:36:23.65377	rejected
9	3	caauth.com	iit ropar	it	Jaipur	Punjab	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1DCCAbwCAQAwgY4xCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxDzAN\nBgNVBAcMBkphaXB1cjESMBAGA1UECgwJaWl0IHJvcGFyMQswCQYDVQQLDAJpdDET\nMBEGA1UEAwwKY2FhdXRoLmNvbTEnMCUGCSqGSIb3DQEJARYYMjAyMWVlYjEyMjVA\naWl0cnByLmFjLmluMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsXcR\n4WT69PXsmJ7h8tnm+h64yuMOKuGzB3E56LX9WEchXXO255tnwTWQch03bd1wq5Mi\nTUsoJ1/STkH6Dr6wPg68jCfqIvw2oKFgtWJvwdqfQXpJ08hs5uPIXc/5W9i0LDIS\ndccpXzfS4nRgNL68oXlufRBWtwfdAnyYwhFwWT9UPJDhITmrn24sPmavnjlk3457\nXPMj2LkBZYkODeeUucS+j3Nl5lFVsg5bGbNtldxvdTnbhD1EN/vPwiejFX1ixE29\noR7oHdtWhsJfuB1TG2PiIs+XWP25yeQykLAHdv5ibVIC5AnWPDrhdacYS8ICb3kI\nHizxwdTqkLOT9zOyjQIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAAuoYPX3XOPd\n6qlL7Bs1Pa8KSfIgZWioSMB9KofyM8PvP7lNxNgQ8U4qsVZvr4FhswyqHlGvl8Dr\nFdJ4WW9z+O28tcMxUpbB8O4LYVMxTR7iIe2VIP+myScoP4cg0WKgnILrg6VlZR9T\naDOQ4JvivKzUDaWxw92uOrH6aC4bvNmmUBAUkUSJmbqv9nOCf/ZCrtDHlkq04fb8\ncz/Kllan4zwPdMi8wgOdI76vJ9NifLOLk178CSIZwDp1ZeTI/FUxAqYGl5CmUMt6\n6Pbb+S1T2HvaTVJdwWfmVvZOkWPt6dOL0IupvVepwJCwdeA/Ept/3q2aAJDHbdGn\nJY1y1dEnnmc=\n-----END CERTIFICATE REQUEST-----\n	2025-04-24 19:45:32.172606	pending
10	3	caauth.com	iit ropar	it	Rupnagar	Punjab	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1jCCAb4CAQAwgZAxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlpaXQgcm9wYXIxCzAJBgNVBAsMAml0\nMRMwEQYDVQQDDApjYWF1dGguY29tMScwJQYJKoZIhvcNAQkBFhgyMDIxZWViMTIy\nNUBpaXRycHIuYWMuaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCo\n8ULWfXtzadLKDAGnqugOWZdZWSqcQi8V4yl/Oi7L5zH9emZeMtMFr2RTXupMo5T7\nE0IVl+5ng6tU0H8EK+UrinnNuvrqbRrc1QNwWLQwrJFQbKoYxh4d+UXDrEDTUdcJ\nmrGaudxRFqkJAaudBnkgV15lMlLoKnyamaPPRim/UIDA8oIYow1Bw/vZ3q6dptKS\nE7oGXDX3CLryLRCzlBZTE40S2rOWxk9Kve5UbfTMANap1q99q+U8NrwnYpSzOnNg\n1T1nOitzgSPwpsOQmJY62gfc+HcteUO4cBbB9M86gN2L484QnrUQnXrpXS1frhdZ\njyjHufPhUmw/v3Mt8/iZAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAL7xdNosm\nbQaTCH+a8+utP0ogL6BhOgD0FpMC2+Ow+6i/6AxF/1kLukn4bvm/oTvji2uIs3+Y\nUzx1Bh4dhN2qdeHwf1k2t9GXiJwaQRbMgRaFuR/Me+X0CXk9WwJVwWi+7kiV8fGQ\nP5ljI5W+fuRSC+tsc1s11lF0a0JWN1SbV83sG3JZusVSs/FIKDnXqbJUvMGyF99A\n1lKQAl7SLfcYICSiBBUrZreVsTqaIPJ8BKh4Md4NJtHBKond6dXhbgNEAEkzkH6C\nHiZsdS69wYXVo2YHB404GBCuVnvsRp9aeVS4hyedynPWmY0q4eus6EiLZBOUFv6Y\nnCuOND3skRM4rQ==\n-----END CERTIFICATE REQUEST-----\n	2025-04-24 19:55:23.540275	pending
11	3	caauth.com	iit ropar	it	Rupnagar	Punjab	IN	2021eeb1225@iitrpr.ac.in	4096	-----BEGIN CERTIFICATE REQUEST-----\nMIIE1jCCAr4CAQAwgZAxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlpaXQgcm9wYXIxCzAJBgNVBAsMAml0\nMRMwEQYDVQQDDApjYWF1dGguY29tMScwJQYJKoZIhvcNAQkBFhgyMDIxZWViMTIy\nNUBpaXRycHIuYWMuaW4wggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDY\nvMFlfQADQOkS1FvBvMrKm4HmTVXm4k4RQiEB52ol+5797xOzVltSYPRSYW/PFgrO\ngdleaglWOoeOe6D+4bhpho7JF5RJ4j3/CTZA0CfctKBjTP/0Bs0BIu3kqZ0VAHt6\nNGhEKdef8+jVBlXSTCrX9HsgEu5uDJX6a4uvP/mu4gWICpIeGPkpxq+dPmQWd2WT\nzCAmQsB0xpGKiEwgmOtVaVH05EAgh1iN4SLcY1AMuLvVzx+P8A5xeyBuUKWSDPmW\nKLOyT7Ff6TUzWyYdjmUkg4VCjmk2RAozGtFl+xOr1wpA2DJQ/FAfqq5Hzjoy+UW1\nNO84glCWibxtW1v5CqILiVeplOTeGSrErYNiL7sXQ31H2E1jvdXi1SwszoXPvJEh\nZp+Kxl9M50xmppgBW9/1CpUkwK2rRQ72NtcjkxEUQpMfPdGGwOzflU5OS7j4neeB\n+B9joONJiR2ZPSKGaIgPvqwQGS6FMuQtAc2HKSrRNt1jwut0E4w3Ovwi4K01EyXa\n4w8Wst5a9w5my1SRKIhMyhZlQaOrScOkSmG8SICg7tQxKW1Lbsx4xkeFxygXoABu\nIxkyeeGC2hYhnhoPukOb8do7ylJlHwm36I3gzXZMQtSvfQuqGeTS3uAgSXQT0RBG\na4NlRdpOXmgLqIANhRZmi/ophWi5qDh+WKTajqUDRQIDAQABoAAwDQYJKoZIhvcN\nAQELBQADggIBABIp5bjaNBP57P2ImCU1YvRzNECJK4M/9C66I3wHdwM2ufIRvDYM\neJnQCovi4PubgKcdUikB0+8LVTmhoQ4LRhdzaZqb/hOTw7KIfcjE51YXjVyW8NO2\nCilTQr3H+/IOs5JVTFgsygJQuj7kr1dYCFoxTSDslv4gpkHsat4zfV6nqH7OCpLO\nrMsWka8QgM2m+JVDxt0bMt8E/7vXvsHeF150yvb9d9ppV7JcA2WXYx0rfPEws/nd\nwGkMxY74MP6pV8Kv8SQ+Ba2lOo09Ax+nfG0Jm1GMqL5GqadTIrAgYf22mXjOtdfe\n58DelyqniRLRON3ZmOdGcubZqQboM0DxNZy3v7J+ymT8wpobd0qG0pNkeBEs1AC9\nOIGcZzgaoWfEQtwAdG8YjebNsH5IyPXj7NeeVEGeTFcduwbxr19oZpfqxcXpUCKa\nxKPuJ1dtVJQAqrUurCtFHOC1If+2sKd7iM1ABPxU/NroorWMRF8fpIM4Kauqe7pN\nwwVaxhd+OLlKjAqFFYGd8zvtfzKFBRay8qKJcDn/GlcMEkmo5AFX0BVUB8Bl4HU5\nM/pSJHHAECZhyP+yLY6SdvxrumFLlgZfdSZvBegz/a+jnUeD+uy8F/CjEcDJW+q2\nHiY2FznQv42xAhsa07lO4FPO+iJwTpnTuB40jr0o5KmXacZhgFAaOZin\n-----END CERTIFICATE REQUEST-----\n	2025-04-24 20:16:19.869244	pending
14	3	caauth.com	iit ropar	it	Rupnagar	Punjab	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1jCCAb4CAQAwgZAxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlpaXQgcm9wYXIxCzAJBgNVBAsMAml0\nMRMwEQYDVQQDDApjYWF1dGguY29tMScwJQYJKoZIhvcNAQkBFhgyMDIxZWViMTIy\nNUBpaXRycHIuYWMuaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCw\nW+YIissDAZ345FP5yTemZOTBXWGK07O+doqTBCFdDTVO9tiEBkb1qVSl1G9/7/Qb\nau95QJD3djr5kxP35/wXL2Ma7KL74dsAH628hhwmp57F9mojD4VNYIbGQ5cedgJJ\ndggW5uzwUmRQObf51mRcFrbu3NBduLvcGQGMOilCDPlXLXUOi+IK8O5s+PkS2+Dw\ngQgUIrWmRQGgJBviSPa2/+kVR8gPKPTVgoxKsfGGPXex3p5/SOkle9AJQsTQ7Wg9\ncCbHNmVJwHND+3o7lVhZ2WHTTBhSntt4YS6f4R1aa7e8AwjeLlga69LAQVcX5f2v\nf+72+ELYgLl7NhCWjLiNAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAC1rit+2E\nIqum8YWEJJUr3miMKDPlBDutNN84qTkiwCilCoriGsS0UChTMWJhFogiM4u/YHnV\nz9ysSMJfBGEe/x0u8EcorFdWjnCyw4z7RUHqLDlecdSfs/hG/vKAO2kaTZtK+Oo3\n+sXIdjW6bGMZ83sGmJYzJr1jGCbI2VO7+kimUezTa8wFJ5pxZF8Z/6xgyVzL2rRT\n4QnFn2ZBw6A9IlT93ahMMUT7GdolIi5hmgpqRMdWluS3Sf+PpanaNyqU4DSZiokB\n1Rkup+eYri8FbEW2tyj0G5gceeePHUluFYW0IClfBfJSX4+nW1kG3OMyPcE7Ib9A\nx40yNADLEjaeFg==\n-----END CERTIFICATE REQUEST-----\n	2025-04-25 04:32:42.798279	pending
12	3	caauth.com	iit ropar	it	Jaipur	Rajasthan	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1zCCAb8CAQAwgZExCzAJBgNVBAYTAklOMRIwEAYDVQQIDAlSYWphc3RoYW4x\nDzANBgNVBAcMBkphaXB1cjESMBAGA1UECgwJaWl0IHJvcGFyMQswCQYDVQQLDAJp\ndDETMBEGA1UEAwwKY2FhdXRoLmNvbTEnMCUGCSqGSIb3DQEJARYYMjAyMWVlYjEy\nMjVAaWl0cnByLmFjLmluMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\nshPVtSbWV+zc0ryWYqb1WXxCFi0a3fz4tt0tiBnxsxcZmH5v5qPnKwXEnGacfkBY\nhIaVv9Y/E+7yVimrk8qwSiqjJMa/ikUKjGYYrc2jGIps383haVRe618ciajVdLGR\n0lbIJcNmzIkcQBkcWK5l8attxGNeM6X/ibuAAHLK5Fa0Ahl+OvkZ+BwY8L0dDcl5\nAy4xdT9yrlqbT2CEy6wzEaCxXbIDnwZo6SwR1PDwkuSf2Z/11eN64G5+KYqmEq7w\nopBSqLP7emlUfvQr+3XDy8XqIeQX10G1Y8f9g5rqPE9PJutx8UdwLYBIkf6XAzRR\nt/Gvvvt9OFE1nOReQh3IxwIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAJGG8isK\n+009alfgFbBLE4DEvQcyqL8jkKv46UjovEpIj1hVxeCDnwrMvp2POtB4rvTyoTnl\nB8ec9SgMvQvKqOTMpbC4YXJV/QbvToLzt92of8Eo/umvdrxeFjT0Vf0NGawMFxkP\nUPkKmToLClScNakHPnGdxlBJozHMGzkiNO0ve/tAGkyQx61nKBkpV/59kojCwBFp\nsI7u4slFw8b7QwwKSKfiNRCEX0aJNgHloq/UAPxteaYGs9xJHxEqF+qIkstTSL7/\nDislrqz0/9oLOFJjIMSAIbIlUx0UjaG/oVd09JHFaX70BIaCZiCc5guh1c72vO4P\nvz3w/Olj9ORSiXQ=\n-----END CERTIFICATE REQUEST-----\n	2025-04-24 20:49:15.552497	rejected
15	3	caauth.com	iit ropar	it	Rupnagar	Punjab	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1jCCAb4CAQAwgZAxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlpaXQgcm9wYXIxCzAJBgNVBAsMAml0\nMRMwEQYDVQQDDApjYWF1dGguY29tMScwJQYJKoZIhvcNAQkBFhgyMDIxZWViMTIy\nNUBpaXRycHIuYWMuaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC6\n4zFvIFENFN+uqpxerJKzdruepY5lPuyRcOXDsKnMjY3ulp6HtDzR8q+72WQVAKd5\nVBySgMgxsZu2gwrSyMr07omnVXXRDDXcLBarONQL1+UlqtMndaLIEs2VV6T7Rquk\n0twf7NntolecXvyDCrW5+OWRLMtgFD/WYyX18BpGXIwG0dBa89CgEwBI28Ryeldj\n0rp2v1LeLQ5eVOve3/P7pN4kiwx7xEqO34Gt5imUnDfVLAREJkYryjx67SqtUl8Q\n/uio6z9SCb4b88biReMliwzg0ysPNyubcF8gS2s8ov6c571dTaI8YkbEeozapu+L\n39PeKYHktKNyzRFOqEFVAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAo7CqeiJs\nXJtB/Uw/kHrXVww1GqHD55W7BmJnq7oKILmY7FblkO1l0W2tUi+oD7zizf+FbDlx\nd5smeYaydYXZUGCh5WFUl84jar1MeHH46/M8GfU9VuRm9yQlJ9a7hTwUWnJ6pfqy\nC3t/LjYdn8ukhNBVgo8v1ZktLsc5Rvdr7rOwN9EKHDb24BZxpWRGMyIK9wad66t3\nF8DruqgAidR+k/qX+soJuaqHs0rNuwq3qt203HJjdnwBJIzuh8Cqqaw6X6ucGaZd\nnuCjWDfUAs04VXaLesBQb4Z0NcM59IOSBIUTMLMxIPUvR/+HlQeQ8oIDh3CxM3Ae\nNCRJ36tvzG1Fvw==\n-----END CERTIFICATE REQUEST-----\n	2025-04-25 04:56:08.590998	pending
16	3	caauth.com	iit ropar	it	Rupnagar	Punjab	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1jCCAb4CAQAwgZAxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlpaXQgcm9wYXIxCzAJBgNVBAsMAml0\nMRMwEQYDVQQDDApjYWF1dGguY29tMScwJQYJKoZIhvcNAQkBFhgyMDIxZWViMTIy\nNUBpaXRycHIuYWMuaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC2\nOFoCRLT2jYf9x9sPINI5PVxOtDLjvOqTyJ0Tta3VZ7ey+/aHfr2ztvRcG4O8/gLl\n6SNkfiY4q2oQwCA4YOBHiBH+rlXcdWp8hCR5BZFeBuaFkuLTL73ReA//Xp2pcNF3\nDI1h3I9fRTmlZMT/bE3Jahd3QuWdIvYas6yxb7bRoEFgSvit/jgdKrqn02rmUzTt\nk7zzpU+ptgIlywYhGTRmDY1Lceg4TJAH14WKicS5txkxeqaUi+AhbV3UOFgtZYLw\nZvnCaAO5Wypr1FUIi/jeUN1C9INHiO1neq/dImHB2fFCLGwL6cgeYx/mwOxUcmOY\nMuW72cWyiHo51QPOLQQNAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAATcj4w1F\nWkpsbP7hpCayrNtgbYVUKh9hrXO0VRA2JhDFFQIKBFvQwiV4aELvDWfF3yQtfBRO\nBQHSGFKilXdVetRWaRoBGaoZ50hYcu7d/CXrDCsXugWWUkFq0gq7OjJ9QrCZ6MoV\nfu8nOv8+kZIhpjk0NCDdy6HM0MPHzQ/cMQasALuYRxkPTqsefe7q53BXPey1DjTr\nunA8GkcnLkukzkFUX4Is6dhogcnBbjg+2f5wK3GjgMxXM3mmaIL+QP52he2OQbci\nmR98MzhO/fiYnoQFq3/xoxY1z5uwxk9aWB+fg2Zow1sq4t1oWiyFlJ8y63j2GIWG\nkZpAYIDoQNakkw==\n-----END CERTIFICATE REQUEST-----\n	2025-04-25 04:57:31.128204	pending
17	3	caauth.com	iit ropar	it	Rupnagar	Punjab	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1jCCAb4CAQAwgZAxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlpaXQgcm9wYXIxCzAJBgNVBAsMAml0\nMRMwEQYDVQQDDApjYWF1dGguY29tMScwJQYJKoZIhvcNAQkBFhgyMDIxZWViMTIy\nNUBpaXRycHIuYWMuaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCb\nPDFH1GCetnuea8ZbhNcF36gHHC5tg0+Qx2jmK2zhyLjyDKTYhYuluWUFhc8qDMtf\njwVm5jzF/QNUkbB6vYCdMoq/6KrREH/fMkSaCLe0sXkoqiKWrUj3qPt4yLKtIzIq\nhnzRgEaWsdh8aB6k6Lm7MWzkJSOk4prwf6oFQCUK/Jsf0dfm3PQ5mWg3i14psSP/\n7mW/hxjgIkm3M+v9avvAWvX10KvYMFWrMfrnQi0C+BRQ0XWxWBuOqod3yg1EzSro\nsjQ/4x/O3QzYlhX2cRY7ATW1714bV+DrOuO27E8b+8g1itr8XNGPY8DaQMJzpG91\nb9EwygpxJOUCqA4hy4LNAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAO6LN8dZQ\nYv/9fe/IPTpTCpXiO5lZGabJAAuAXJo95mROpRGT4SzEr+HoZZI0ReBfvsN3vsc7\n2LmaPk8qNN58o3kgj3b0nnr/M2WJ+tdB+J10U253UJASKUznPHZRx1MN56Qwn1/F\nF2ftFWgb9tInsfqlChmvcc2zMdQ2INS/xJ4vZh/Fw5P6Uq1G/uYjfOpRYt1C/3Mw\n7PVqk1fIcrzBQMRZNs12PrN0ZWgxdpJsVDmzvp4szGgF0c+qnc9oYUkpZkAEmUXg\non4QP0B3DLgZ3Rrt5RWYXEmKN1s7ezkJKwQojqikf7ha1g9qQbXVg9uj/0eXQ//d\nKKvpNim+O4drSQ==\n-----END CERTIFICATE REQUEST-----\n	2025-04-25 04:59:32.715944	pending
18	3	caauth.com	iit ropar	it	Rupnagar	Punjab	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1jCCAb4CAQAwgZAxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlpaXQgcm9wYXIxCzAJBgNVBAsMAml0\nMRMwEQYDVQQDDApjYWF1dGguY29tMScwJQYJKoZIhvcNAQkBFhgyMDIxZWViMTIy\nNUBpaXRycHIuYWMuaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDZ\n2GlRw8fWyU9wxsl6wM2pDUIPDSE9PG6A6gu2RZrpIuTobHCh9i2Au+dggiyhoXb+\nqLru2el65i68fHYpR4G164+z13RCH/N0nAPgknLicOoux2ImNMS+2kDJAzUKpBAJ\nzFyKEoedIyA2mycEDPwmzil9DM/PUC+GctVLD42/3HvJxYnogn1+0JBEBbwtIzFi\nK5NGNTE3sxuqAEgMIrdwN4WM/tMDclyHxAALZ9jc/RB37EmNhzGmns2MP6Slrvpw\naNJVuHVHl63sTSXwQQ2W6VMTI6PGW++L4CKgZiImnpRLLDfwrKzzor+RuLWneRJB\nki6iXzeGTh7+lieHW9AdAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAmClmLCwn\nImCJtkNS257aiTJE53/sqdDwxVUHNHvpYry4DDPbtgffn97Qr2swNgNIXk7gE+mz\n3dMvjwdoTYwWfX1n7pcW33IiiHIdvEyPKZS4JIXPiO2QsZJ/5agVFNz81OFoersD\nsL9pDRfK0+gJzGpLBTS5L7visbZRRPiFPU9NxuCy2FVsF76CESFCYiNN62NrQ6/8\n96oGfTmDkgC+03cF8uB9DU3HDVs8ZvsMhztVAZ7H/irv/fN7EKhJVB1rSX+MIi9O\nxTYqvKpXmcorSUQbBec9eOpGhGkwG7VCkDeOEe038mxUaBQpiMx3OfIFdRkiCRCP\nVODUf/OqiWD5Qg==\n-----END CERTIFICATE REQUEST-----\n	2025-04-25 06:05:25.776036	pending
19	3	caauth.com	iit ropar	it	Rupnagar	Punjab	IN	2021eeb1225@iitrpr.ac.in	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC1jCCAb4CAQAwgZAxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlpaXQgcm9wYXIxCzAJBgNVBAsMAml0\nMRMwEQYDVQQDDApjYWF1dGguY29tMScwJQYJKoZIhvcNAQkBFhgyMDIxZWViMTIy\nNUBpaXRycHIuYWMuaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDI\n/IljK++n50y0s2Nri/XSJ0u8xqY+qeUH7fY1cZREH0X8lJk2NioQxP2wO/38jrYL\nhNplY8gfTJCVODYiHd0DUueqJdIQ+Gy3Yv7v9x89Xg1UL238YRJSbwPhO9diHTxY\nNcQUW8vqFQFL/i8c0Ba/JBCLSkCtg7rabISkTrasvoUwdw5Y38y50U7LpDrobiJk\nY7BHp9gSb54oLxV8HQP8jaXA3ALIlVOrR2+CF+SSNsl1CxvHjXRe95GC7t3/7tqT\nMfQQUopqr9Kdo34wQPPaqB3piUk/XVZM9jvvoSwg5YhjaNG6Slx3Uu0ErXGs3aDT\nH3taVa+2alAgSPysb+wLAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAm54nJLhz\n8TRm52+2GgGVIhIq6cFadxyqhuhdipcqVU0mCtTdrLRjigI+k26PM2MrnUPNvZmN\nKZHcU/rUooNamJ1FeXknkX1GjSWAzF7siChPnl7OHJllKN8H1CHdJqA9B6T3ZR+d\nxCrdFDYmhpl7+I2ZKsICXasKA+Kvq4uzmVm95OvaP9ssPHoZRrJHyZUqFVqSJFiW\nKH89EqD/2Z6kdOxcjlolmgNZ/bZEE8LsmUSyA3HYfVJu/yYPOflMtpABjw584pKa\nAOPEwJzZcY5UjS64N1hYOln/lB1mal1WZWnJ2rKiPAjH/KVyrZm0o3T7uV5QOEnU\n/xoWOwHifqcdFw==\n-----END CERTIFICATE REQUEST-----\n	2025-04-25 07:11:19.514873	pending
13	3	caauth.com	iit ropar	it	Jaipur	Rajasthan	IN	agarwalyash0707@gmail.com	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC2DCCAcACAQAwgZIxCzAJBgNVBAYTAklOMRIwEAYDVQQIDAlSYWphc3RoYW4x\nDzANBgNVBAcMBkphaXB1cjESMBAGA1UECgwJaWl0IHJvcGFyMQswCQYDVQQLDAJp\ndDETMBEGA1UEAwwKY2FhdXRoLmNvbTEoMCYGCSqGSIb3DQEJARYZYWdhcndhbHlh\nc2gwNzA3QGdtYWlsLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB\nAKu4qROEpi0UYwfo2qEdup9Pop6OuC16KHy8ZKZLVydm2UErVxAHCN9qsRMz9L7B\ni7yVYfMC7W6wou0uGGZNECSzLXVtpr21w9L+Gd02kiNT6eNPqSd6yl5kGPR63K8I\nzPRAmOgvrInHnXQbcL5vgAgRIhBuS2bxshwREGMzrqYxXXJLUGY8BGzQq4u5DwA4\nL1wrV1D/MKEmxqx9HxNBJdJXeqbz64VYSoZFgAD5p/H3w14I9+qnMwATmhDSrLz5\nEmgka6FbyvsfVSHexLdFi791BLuO4t3EotcfZEPD7aN9vNc0liYNaWNcyEXOcxFF\nAkaFs5sBQmT8CFJ2dVvqUjkCAwEAAaAAMA0GCSqGSIb3DQEBCwUAA4IBAQA6f9BI\ny+OXGoriaIGJojrc/1Uy15AA3qknjzO9XVm1IedlVeyiL6sG7oH7mqVs5FO5lg6N\nYF2WLtFZuDS8ZidES6ew0JZExBtIZ8txQuZBcoW4FNSZA4h+enitvM6uiYz0KaRS\n6eOaRuFFG1TjdFNAARV+Kb0yEUPfGK+Q3ypOALd+q7zrvLSpdpRa+3I7xq/Jkn+/\nUUV5dzn6bfLwuOICF195EQ9V0aXJuK+CgpAvYc5ojQyugZ7FLwoeRqi3no0dvOWp\nsgAy9ZrMXnxlWGWlXkqdZP28XbvXalpDvb1nRkxg9SmCqq7q4UY+uhfHyux0soUA\nzqELPmf9ffyYMmRO\n-----END CERTIFICATE REQUEST-----\n	2025-04-25 04:09:57.186756	rejected
4	3	www.caauth.com	IIT Ropar	IT 	Rupnagar	Punjab	IN	caservice2025@gmail.com	2048	-----BEGIN CERTIFICATE REQUEST-----\nMIIC2jCCAcICAQAwgZQxCzAJBgNVBAYTAklOMQ8wDQYDVQQIDAZQdW5qYWIxETAP\nBgNVBAcMCFJ1cG5hZ2FyMRIwEAYDVQQKDAlJSVQgUm9wYXIxDDAKBgNVBAsMA0lU\nIDEXMBUGA1UEAwwOd3d3LmNhYXV0aC5jb20xJjAkBgkqhkiG9w0BCQEWF2Nhc2Vy\ndmljZTIwMjVAZ21haWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC\nAQEA0zGTP4lAgGJmwz2SfAxf8NK3gT5w4zJ+OPQYWAl0nWPlvKlMG+Wt9EYzNvnp\nCDndouIqzkL1HionpU94Jckpoq/veFJ+YstiErViRnnoSBUOr5CqgCB/17/lIW1K\n9H7kvrTMiPpjOtBY8htQeL0GC3/Mx3AS7HSCblAkU6IpKosBYGJf84sCzbnp9duo\nmZmWmKFi1YMdCt9zh6Sro9Z4tTZPjeQhaEyzQtpsCfyKKnmxdfF35YqE9/1Kt7yN\nGDZUle42UGCDqQZylmOzNal8U8Y3bKOyJ1c3u9sojzwkh6Em1Q+jZvEuWhu6uTpK\n9VwOJeNi0DkdjC2p/CdlNZDPCQIDAQABoAAwDQYJKoZIhvcNAQELBQADggEBAK5+\nqfzu5ewl/OFKJizreI1hPP/CUJk/d8iwyyEze4+H74TSL/Bihpml6u2heDx6zcIo\nuNQieBBzUumANET1G0KxeBqLB5Y8Svu0DKfF0hAH6g9buacVZ2j97oQG+uZiEPIh\n3HGBmkz95ZUXPZ148uLgKK0/g02ivQgCgqeJWWTNc79j7trD+eHbnq+gSVcBdjSY\nw/Tk0XEIATfg9amXJHBhTCZJexU9BTgXt5bUDx2oKfFNwmJknZSKvrj0KVg+3qxV\nDBDnWGQBCzV4I0MP8vj8mEYu/2sl3JQ0+lxd/TejPTazw5TadehfRSuUmlKGecoN\nUJ2tdyh0GX49IUzweIs=\n-----END CERTIFICATE REQUEST-----\n	2025-03-25 10:56:54.538254	rejected
\.


--
-- Data for Name: issued_certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issued_certificates (id, user_id, csr_id, domain, certificate, issued_at, valid_till) FROM stdin;
\.


--
-- Data for Name: revoked_certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.revoked_certificates (id, certificate_id, revoked_at, reason) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role, is_verified, otp, otp_expiry, created_at, updated_at) FROM stdin;
3	Yash@123	agarwalyash0707@gmail.com	$2b$10$TKh6GsdrRZs3Z4ysvwQrh.nB1cw5kwHRxdQUIm2n1n6zRHVvB5fpO	client	t	\N	\N	2025-03-25 07:39:50.415804	2025-03-25 07:39:50.415804
5	admin	admin@example.com	$2b$10$xxO6S.5t5el0eOA047BcdOzvwjRQcCHOAGHERSvocqSIWJoXOUzyK	admin	t	\N	\N	2025-04-25 15:01:12.262977	2025-04-25 15:01:12.262977
\.


--
-- Name: csr_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.csr_requests_id_seq', 19, true);


--
-- Name: issued_certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.issued_certificates_id_seq', 1, false);


--
-- Name: revoked_certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.revoked_certificates_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: csr_requests csr_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csr_requests
    ADD CONSTRAINT csr_requests_pkey PRIMARY KEY (id);


--
-- Name: issued_certificates issued_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issued_certificates
    ADD CONSTRAINT issued_certificates_pkey PRIMARY KEY (id);


--
-- Name: revoked_certificates revoked_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revoked_certificates
    ADD CONSTRAINT revoked_certificates_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: csr_requests csr_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csr_requests
    ADD CONSTRAINT csr_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: issued_certificates issued_certificates_csr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issued_certificates
    ADD CONSTRAINT issued_certificates_csr_id_fkey FOREIGN KEY (csr_id) REFERENCES public.csr_requests(id) ON DELETE CASCADE;


--
-- Name: issued_certificates issued_certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issued_certificates
    ADD CONSTRAINT issued_certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: revoked_certificates revoked_certificates_certificate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revoked_certificates
    ADD CONSTRAINT revoked_certificates_certificate_id_fkey FOREIGN KEY (certificate_id) REFERENCES public.issued_certificates(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

