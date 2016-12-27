--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: VIDEOS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "VIDEOS" (
    "ID" bigint NOT NULL,
    "TIEUDE" text,
    "MOTA" text,
    "KEY" text,
    "IMAGE" text
);


ALTER TABLE "VIDEOS" OWNER TO postgres;

--
-- Name: VIDEOS_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "VIDEOS_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "VIDEOS_ID_seq" OWNER TO postgres;

--
-- Name: VIDEOS_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "VIDEOS_ID_seq" OWNED BY "VIDEOS"."ID";


--
-- Name: VIDEOS ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "VIDEOS" ALTER COLUMN "ID" SET DEFAULT nextval('"VIDEOS_ID_seq"'::regclass);


--
-- Data for Name: VIDEOS; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "VIDEOS" ("ID", "TIEUDE", "MOTA", "KEY", "IMAGE") FROM stdin;
1	Saint Sister - Tin Man	from Bob Gallagher	196090476	608475929_130x73.jpg
2	Max Cooper - Order from Chaos - Official Video by Maxime Causeret	from Max Cooper	196269431	608700439_130x73.jpg
3	MOURN - Irrational Friend	from Roger Guàrdia	196274484	608702880_130x73.jpg
4	In the Dungeon : NxWorries “Sidepiece”	from rossangeles	195510064	607741118_130x73.jpg
5	CARAVANE PALACE - MIDNIGHT	from Julien + Adrien	195421709	607638083_130x73.jpg
7	JMII | Bailar (Official Video)	from Dedo Ciego	176513811	592106635_130x73[1].jpg
8	Naughty Boy - Should’ve Been Me feat. Kyla and Popcaan	from Ben Strebel	193517656	606665767_130x73.jpg
9	Kakkmaddafakka - Lilac (OFFICIAL MUSIC VIDEO)	from Carlín Díaz	193751559	605544723_130x73.jpg
6	Chelou - Halfway to Nowhere (Official Music Video)	from Andy Baker	194805158	606860449_130x73.jpg
11	Makeba / Jain	from Greg&Lio	193674451	605460090_130x73.jpg
\.


--
-- Name: VIDEOS_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"VIDEOS_ID_seq"', 11, true);


--
-- Name: VIDEOS VIDEOS_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "VIDEOS"
    ADD CONSTRAINT "VIDEOS_pkey" PRIMARY KEY ("ID");


--
-- PostgreSQL database dump complete
--

