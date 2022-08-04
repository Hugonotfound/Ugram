DROP TABLE IF EXISTS t_notification;

DROP TABLE IF EXISTS t_likecomment;

DROP TABLE IF EXISTS t_comment;

DROP TABLE IF EXISTS t_likepost;

DROP TABLE IF EXISTS t_tag;

DROP TABLE IF EXISTS t_posthashtag;

DROP TABLE IF EXISTS t_post;

DROP TABLE IF EXISTS t_hashtag;

DROP TABLE IF EXISTS t_similarities;

DROP TABLE IF EXISTS t_follow;

DROP TABLE IF EXISTS t_person;

# -----------------------------------------------------------------------------
#       TABLE : t_person
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_person
 (
   id_person BIGINT(8) NOT NULL AUTO_INCREMENT,
   lastname_person VARCHAR(35) NOT NULL,
   forename_person VARCHAR(35) NOT NULL,
   gender_person VARCHAR(1) NOT NULL,
   birthdate_person DATE NOT NULL,
   username_person VARCHAR(35) NOT NULL,
   mail_person VARCHAR(50) NOT NULL,
   password_person VARCHAR(128) NOT NULL,
   phone_person VARCHAR(15) NOT NULL,
   confidentiality_person VARCHAR(10) NOT NULL,
   displayonline_person BOOLEAN NOT NULL,
   bio_person VARCHAR(1000) NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_person) 
 ) 
 comment = "";

ALTER TABLE t_person
  ADD UNIQUE (username_person);

ALTER TABLE t_person
  ADD UNIQUE (mail_person);

# -----------------------------------------------------------------------------
#       TABLE : t_follow
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_follow
 (
   id_person_following BIGINT(8) NOT NULL,
   id_person_followed BIGINT(8) NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_person_following,id_person_followed) 
 ) 
 comment = "";

CREATE INDEX i_fk_t_follow_t_person
     ON t_follow (id_person_following ASC);

CREATE INDEX i_fk_t_follow_t_person1
     ON t_follow (id_person_followed ASC);

ALTER TABLE t_follow 
  ADD FOREIGN KEY fk_t_follow_t_person (id_person_following)
      REFERENCES t_person (id_person);

ALTER TABLE t_follow
  ADD FOREIGN KEY fk_t_follow_t_person1 (id_person_followed)
      REFERENCES t_person (id_person);

# -----------------------------------------------------------------------------
#       TABLE : t_similarities
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_similarities
 (
   id_person_1 BIGINT(8) NOT NULL,
   id_person_2 BIGINT(8) NOT NULL,
   index_similarities BIGINT(12) NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_person_1,id_person_2) 
 ) 
 comment = "";

CREATE INDEX i_fk_t_similarities_t_person
     ON t_similarities (id_person_1 ASC);

CREATE INDEX i_fk_t_similarities_t_person1
     ON t_similarities (id_person_2 ASC);

ALTER TABLE t_similarities 
  ADD FOREIGN KEY fk_t_similarities_t_person (id_person_1)
      REFERENCES t_person (id_person);

ALTER TABLE t_similarities
  ADD FOREIGN KEY fk_t_similarities_t_person1 (id_person_2)
      REFERENCES t_person (id_person);

# -----------------------------------------------------------------------------
#       TABLE : t_post
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_post
 (
   id_post BIGINT(8) NOT NULL AUTO_INCREMENT,
   id_person BIGINT(8) NOT NULL,
   caption_post VARCHAR(1000) NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_post)
 ) 
 comment = "";

CREATE INDEX i_fk_t_post_t_person
     ON t_post (id_post ASC);

ALTER TABLE t_post
  ADD FOREIGN KEY fk_t_post_t_person (id_person)
      REFERENCES t_person (id_person) 
           ON DELETE CASCADE;

# -----------------------------------------------------------------------------
#       TABLE : t_hashtag
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_hashtag
 (
   id_hashtag BIGINT(8) NOT NULL AUTO_INCREMENT,
   name_hashtag VARCHAR(50) NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_hashtag)
 ) 
 comment = "";

# -----------------------------------------------------------------------------
#       TABLE : t_posthashtag
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_posthashtag
 (
   id_post BIGINT(8) NOT NULL,
   id_hashtag BIGINT(8) NOT NULL,
   created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
   updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
   , PRIMARY KEY (id_post,id_hashtag) 
 ) 
 comment = "";

CREATE INDEX i_fk_t_posthashtag_t_post
     ON t_posthashtag (id_post ASC);

CREATE INDEX i_fk_t_posthashtag_t_hashtag
     ON t_posthashtag (id_hashtag ASC);

ALTER TABLE t_posthashtag
  ADD FOREIGN KEY fk_t_posthashtag_t_post (id_post)
      REFERENCES t_post (id_post)
           ON DELETE CASCADE;

ALTER TABLE t_posthashtag
  ADD FOREIGN KEY fk_t_posthashtag_t_person (id_hashtag)
      REFERENCES t_hashtag (id_hashtag)
           ON DELETE CASCADE;

# -----------------------------------------------------------------------------
#       TABLE : t_tag
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_tag
 (
   id_post BIGINT(8) NOT NULL,
   id_person BIGINT(8) NOT NULL,
   created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
   updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
   , PRIMARY KEY (id_post,id_person) 
 ) 
 comment = "";

CREATE INDEX i_fk_t_tag_t_post
     ON t_tag (id_post ASC);

CREATE INDEX i_fk_t_tag_t_person
     ON t_tag (id_person ASC);

ALTER TABLE t_tag
  ADD FOREIGN KEY fk_t_tag_t_post (id_post)
      REFERENCES t_post (id_post)
           ON DELETE CASCADE;

ALTER TABLE t_tag
  ADD FOREIGN KEY fk_t_tag_t_person (id_person)
      REFERENCES t_person (id_person)
           ON DELETE CASCADE;

# -----------------------------------------------------------------------------
#       TABLE : t_likepost
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_likepost
 (
   id_post BIGINT(8) NOT NULL,
   id_person BIGINT(8) NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_post,id_person) 
 ) 
 comment = "";

CREATE INDEX i_fk_t_likepost_t_post
     ON t_likepost (id_post ASC);

CREATE INDEX i_fk_t_likepost_t_person
     ON t_likepost (id_person ASC);

ALTER TABLE t_likepost
  ADD FOREIGN KEY fk_t_likepost_t_post (id_post)
      REFERENCES t_post (id_post) 
           ON DELETE CASCADE;

ALTER TABLE t_likepost
  ADD FOREIGN KEY fk_t_likepost_t_person (id_person)
      REFERENCES t_person (id_person)
           ON DELETE CASCADE;

# -----------------------------------------------------------------------------
#       TABLE : t_comment
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_comment
 (
   id_comment BIGINT(8) NOT NULL AUTO_INCREMENT,
   id_post BIGINT(8) NOT NULL,
   id_person BIGINT(8) NOT NULL,
   text_comment VARCHAR(500) NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_comment)
 ) 
 comment = "";

CREATE INDEX i_fk_t_comment_t_post
     ON t_comment (id_post ASC);

CREATE INDEX i_fk_t_comment_t_person
     ON t_comment (id_person ASC);

ALTER TABLE t_comment
  ADD FOREIGN KEY fk_t_comment_t_post (id_post)
      REFERENCES t_post (id_post) 
           ON DELETE CASCADE;

ALTER TABLE t_comment
  ADD FOREIGN KEY fk_t_comment_t_person (id_person)
      REFERENCES t_person (id_person)
           ON DELETE CASCADE;

# -----------------------------------------------------------------------------
#       TABLE : t_likecomment
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_likecomment
 (
   id_comment BIGINT(8) NOT NULL,
   id_person BIGINT(8) NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_comment,id_person) 
 ) 
 comment = "";

CREATE INDEX i_fk_t_likecomment_t_comment
     ON t_likecomment (id_comment ASC);

CREATE INDEX i_fk_t_likecomment_t_person
     ON t_likecomment (id_person ASC);

ALTER TABLE t_likecomment
  ADD FOREIGN KEY fk_t_likecomment_t_comment (id_comment)
      REFERENCES t_comment (id_comment) 
           ON DELETE CASCADE;

ALTER TABLE t_likecomment
  ADD FOREIGN KEY fk_t_likecomment_t_person (id_person)
      REFERENCES t_person (id_person)
           ON DELETE CASCADE;

# -----------------------------------------------------------------------------
#       TABLE : t_notification
# -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS t_notification
 (
   id_notification BIGINT(8) NOT NULL AUTO_INCREMENT,
   id_person_receiving BIGINT(8) NOT NULL,
   id_person_sending BIGINT(8) NOT NULL,
   type_notification VARCHAR(12) NOT NULL,
   isread_notification BOOLEAN NOT NULL,
   id_post BIGINT(8) NULL,
   id_comment BIGINT(8) NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   , PRIMARY KEY (id_notification) 
 ) 
 comment = "";

CREATE INDEX i_fk_t_notification_t_person_receiving
     ON t_notification (id_person_receiving ASC);

CREATE INDEX i_fk_t_notification_t_person_sending
     ON t_notification (id_person_sending ASC);
     
CREATE INDEX i_fk_t_notification_t_person_post
     ON t_notification (id_post ASC);

CREATE INDEX i_fk_t_notification_t_person_comment
     ON t_notification (id_comment ASC);

ALTER TABLE t_notification
  ADD FOREIGN KEY fk_t_notification_t_person_receiving (id_person_receiving)
      REFERENCES t_person (id_person)
           ON DELETE CASCADE;

ALTER TABLE t_notification
  ADD FOREIGN KEY fk_t_notification_t_person_sending (id_person_sending)
      REFERENCES t_person (id_person)
           ON DELETE CASCADE;

ALTER TABLE t_notification
  ADD FOREIGN KEY fk_t_notification_t_post (id_post)
      REFERENCES t_post (id_post)
           ON DELETE CASCADE;

ALTER TABLE t_notification
  ADD FOREIGN KEY fk_t_notification_t_comment (id_comment)
      REFERENCES t_comment (id_comment)
           ON DELETE CASCADE;

# -----------------------------------------------------------------------------
#       TABLE : t_person
# -----------------------------------------------------------------------------

INSERT INTO t_person(id_person,lastname_person,forename_person,gender_person,birthdate_person,username_person,mail_person,password_person,phone_person,confidentiality_person,displayonline_person,bio_person) VALUES (1,'Schmidt','Simon','M','2000-03-18','USERNAME1','simon.schmidt@utbm.fr','0ddfa475f8fc7dcf9cf167caee82c407e201d35e4d28fc2ebec9c1e14e957672fe61eb0f2920fa33da9da6de2a7a972efab22cdb81889a0bd0648aea5d56375e','+33637386097','PUBLIC',true,'Ma bio');
INSERT INTO t_person(id_person,lastname_person,forename_person,gender_person,birthdate_person,username_person,mail_person,password_person,phone_person,confidentiality_person,displayonline_person,bio_person) VALUES (2,'Jean','Dupont','M','1996-07-21','Pseudo','jean.dupont@utbm.fr','0ddfa475f8fc7dcf9cf167caee82c407e201d35e4d28fc2ebec9c1e14e957672fe61eb0f2920fa33da9da6de2a7a972efab22cdb81889a0bd0648aea5d56375e','418558542654','PRIVATE',true,'Autre bio');
INSERT INTO t_person(id_person,lastname_person,forename_person,gender_person,birthdate_person,username_person,mail_person,password_person,phone_person,confidentiality_person,displayonline_person,bio_person) VALUES (3,'Jean','Michel','M','1955-02-22','MichJ','jean.michel@utbm.fr','0ddfa475f8fc7dcf9cf167caee82c407e201d35e4d28fc2ebec9c1e14e957672fe61eb0f2920fa33da9da6de2a7a972efab22cdb81889a0bd0648aea5d56375e','0389653265','PUBLIC',true,'Bio');

# -----------------------------------------------------------------------------
#       TABLE : t_follow
# -----------------------------------------------------------------------------

INSERT INTO t_follow (id_person_following,id_person_followed) VALUES (1,2);
INSERT INTO t_follow (id_person_following,id_person_followed) VALUES (1,3);
INSERT INTO t_follow (id_person_following,id_person_followed) VALUES (2,3);
INSERT INTO t_follow (id_person_following,id_person_followed) VALUES (3,1);

# -----------------------------------------------------------------------------
#       TABLE : t_post
# -----------------------------------------------------------------------------

INSERT INTO t_post (id_post,id_person,caption_post) VALUES (1,1,'Mes vacances 2016 à Barcelone avec Jean Dupont');
INSERT INTO t_post (id_post,id_person,caption_post) VALUES (2,1,'Mes vacances 2019 à Majorque');
INSERT INTO t_post (id_post,id_person,caption_post) VALUES (3,2,'Mes études 2022 à Québec');

# -----------------------------------------------------------------------------
#       TABLE : t_hashtag
# -----------------------------------------------------------------------------

INSERT INTO t_hashtag (id_hashtag,name_hashtag) VALUES (1,'barcelone');
INSERT INTO t_hashtag (id_hashtag,name_hashtag) VALUES (2,'2019');
INSERT INTO t_hashtag (id_hashtag,name_hashtag) VALUES (3,'canada');
INSERT INTO t_hashtag (id_hashtag,name_hashtag) VALUES (4,'québec');

# -----------------------------------------------------------------------------
#       TABLE : t_posthashtag
# -----------------------------------------------------------------------------

INSERT INTO t_posthashtag (id_post,id_hashtag) VALUES (1,1);
INSERT INTO t_posthashtag (id_post,id_hashtag) VALUES (2,2);
INSERT INTO t_posthashtag (id_post,id_hashtag) VALUES (2,4);
INSERT INTO t_posthashtag (id_post,id_hashtag) VALUES (3,3);
INSERT INTO t_posthashtag (id_post,id_hashtag) VALUES (3,4);

# -----------------------------------------------------------------------------
#       TABLE : t_similarities
# -----------------------------------------------------------------------------

INSERT INTO t_similarities (id_person_1,id_person_2,index_similarities) VALUES (1,2,1);
INSERT INTO t_similarities (id_person_1,id_person_2,index_similarities) VALUES (1,3,0);
INSERT INTO t_similarities (id_person_1,id_person_2,index_similarities) VALUES (2,3,0);

# -----------------------------------------------------------------------------
#       TABLE : t_tag
# -----------------------------------------------------------------------------

INSERT INTO t_tag (id_post,id_person) VALUES (1,2);

# -----------------------------------------------------------------------------
#       TABLE : t_likepost
# -----------------------------------------------------------------------------

INSERT INTO t_likepost (id_post,id_person) VALUES (1,2);
INSERT INTO t_likepost (id_post,id_person) VALUES (2,1);
INSERT INTO t_likepost (id_post,id_person) VALUES (2,2);
INSERT INTO t_likepost (id_post,id_person) VALUES (3,3);

# -----------------------------------------------------------------------------
#       TABLE : t_comment
# -----------------------------------------------------------------------------

INSERT INTO t_comment (id_comment,id_post,id_person,text_comment) VALUES (1,1,2,'Incroyables ces vacances waouh !');
INSERT INTO t_comment (id_comment,id_post,id_person,text_comment) VALUES (2,1,1,'Oui génial en effet, merci :)');
INSERT INTO t_comment (id_comment,id_post,id_person,text_comment) VALUES (3,2,3,'Elle est floue ta photo...');

# -----------------------------------------------------------------------------
#       TABLE : t_likecomment
# -----------------------------------------------------------------------------

INSERT INTO t_likecomment (id_comment,id_person) VALUES (1,1);
INSERT INTO t_likecomment (id_comment,id_person) VALUES (2,2);
INSERT INTO t_likecomment (id_comment,id_person) VALUES (3,3);

# -----------------------------------------------------------------------------
#       TABLE : t_notification
# -----------------------------------------------------------------------------

# Likepost
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (1,2,'LIKEPOST',false,1,null);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (1,1,'LIKEPOST',false,2,null);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (1,2,'LIKEPOST',false,2,null);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (2,3,'LIKEPOST',false,3,null);

# Comment
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (1,2,'COMMENT',false,1,1);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (1,1,'COMMENT',false,1,2);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (1,3,'COMMENT',false,2,3);

# Likecomment
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (2,1,'LIKECOMMENT',false,1,1);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (1,2,'LIKECOMMENT',false,1,2);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (3,3,'LIKECOMMENT',false,2,3);

# Follower
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (2,1,'FOLLOWER',false,null,null);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (3,1,'FOLLOWER',false,null,null);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (3,2,'FOLLOWER',false,null,null);
INSERT INTO t_notification (id_person_receiving,id_person_sending,type_notification,isread_notification,id_post,id_comment) 
VALUES (1,3,'FOLLOWER',false,null,null);