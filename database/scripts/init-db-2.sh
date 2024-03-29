#!/bin/bash

# Create dev database template from current women_health_db state.
psql -U postgres -c "DROP DATABASE IF EXISTS women_health_dev_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE women_health_dev_template WITH TEMPLATE women_health_db ENCODING 'UTF-8';";



# Clear database tables.
psql women_health_db postgres << EOF
  TRUNCATE
  activity_category,
  activity_category_measurement_type,
  activity_record,
  budget_category,
  budget_category_type,
  budget_record,
  board,
  board_subject,
  medication_course,
  medication_course_taking,
  mood,
  period_intensity,
  period_record,
  period_record_symptoms_symptom,
  symptom,
  "user",
  user_administrated_boards_board,
  user_boards_board
  CASCADE;
EOF
# Reset tables primary key sequence.
psql women_health_db postgres << EOF
  ALTER SEQUENCE activity_category_id_seq RESTART WITH 1;
  ALTER SEQUENCE activity_category_measurement_type_id_seq RESTART WITH 1;
  ALTER SEQUENCE activity_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE budget_category_id_seq RESTART WITH 1;
  ALTER SEQUENCE budget_category_type_id_seq RESTART WITH 1;
  ALTER SEQUENCE budget_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE board_id_seq RESTART WITH 1;
  ALTER SEQUENCE board_subject_id_seq RESTART WITH 1;
  ALTER SEQUENCE medication_course_id_seq RESTART WITH 1;
  ALTER SEQUENCE medication_course_taking_id_seq RESTART WITH 1;
  ALTER SEQUENCE period_record_id_seq RESTART WITH 1;
  ALTER SEQUENCE symptom_id_seq RESTART WITH 1;
  ALTER SEQUENCE user_id_seq RESTART WITH 1;
EOF



# Seed database with testing data.
psql women_health_db postgres << EOF
  INSERT INTO "user" (username,        password                                      )
  VALUES             ('john-doe',      '8bd309ffba83c3db9a53142b052468007b'          ),
                     ('jessica-stark', '8bd912e2fe84cd93c457142a1d7e77136c3bc954f183');
EOF
psql women_health_db postgres << EOF
  INSERT INTO board_subject (name        )
  VALUES                    ('budget'    ),
                            ('activities');
EOF
psql women_health_db postgres << EOF
  INSERT INTO board (name                 , "subjectId")
  VALUES            ('clever-budgetiers'  , 1          ),
                    ('mega-economists'    , 1          ),
                    ('beautiful-sportsmen', 2          ),
                    ('productive-people'  , 2          );
EOF
psql women_health_db postgres << EOF
  INSERT INTO user_boards_board ("userId", "boardId")
  VALUES                        (1       , 1        ),
                                (2       , 1        ),
                                (2       , 2        ),
                                (2       , 3        ),
                                (1       , 4        ),
                                (2       , 4        );
EOF
psql women_health_db postgres << EOF
  INSERT INTO user_administrated_boards_board ("userId", "boardId")
  VALUES                                      (1       , 1        ),
                                              (2       , 2        ),
                                              (2       , 3        ),
                                              (1       , 4        );
EOF
psql women_health_db postgres << EOF
  INSERT INTO budget_category_type (name     )
  VALUES                           ('expense'),
                                   ('income' );
EOF
psql women_health_db postgres << EOF
  INSERT INTO budget_category    (name       , "typeId", "boardId")
  VALUES                         ('clothes'  , 1       , 1        ),
                                 ('education', 1       , 1        ),
                                 ('gifts'    , 1       , 2        ),
                                 ('gifts'    , 2       , 2        ),
                                 ('salary'   , 2       , 2        );
EOF
psql women_health_db postgres << EOF
  INSERT INTO budget_record    (amount, date        , "isTrashed", "categoryId")
  VALUES                       (100   , '2022-08-01', TRUE       ,  1          ),
                               (400   , '2022-08-01', TRUE       ,  2          ),
                               (25    , '2022-08-01', FALSE      ,  2          ),
                               (30    , '2022-08-02', FALSE      ,  3          ),
                               (10    , '2022-08-02', FALSE      ,  3          ),
                               (230   , '2022-08-03', FALSE      ,  4          );
EOF
psql women_health_db postgres << EOF
  INSERT INTO activity_category_measurement_type (name          )
  VALUES                                         ('quantitative'),
                                                 ('boolean'     );
EOF
psql women_health_db postgres << EOF
  INSERT INTO activity_category (name       , "boardId", "measurementTypeId", "ownerId", "unit")
  VALUES                        ('running'  , 3        , 1                  , 2        , 'km'  ),
                                ('pushups'  , 3        , 1                  , 2        , 'time'),
                                ('no sweets', 3        , 2                  , 2        , NULL  ),
                                ('sleep'    , 3        , 1                  , 2        , 'hour'),
                                ('reading'  , 4        , 1                  , 1        , 'page'),
                                ('meditate' , 4        , 1                  , 2        , 'min' );
EOF
psql women_health_db postgres << EOF
  INSERT INTO activity_record ("booleanValue", "comment"              , "date"      , "quantitativeValue", "categoryId")
  VALUES                      (NULL          , ''                     , '2022-08-01', 3.5                , 1           ),
                              (NULL          , ''                     , '2022-08-01', 50                 , 2           ),
                              (true          , 'it was easy today'    , '2022-08-01', NULL               , 3           ),
                              (NULL          , ''                     , '2022-08-02', 7.25               , 4           ),
                              (NULL          , 'Read chapter about DB', '2022-08-02', 6                  , 5           ),
                              (NULL          , 'running in hills'     , '2022-08-03', 4                  , 1           ),
                              (NULL          , ''                     , '2022-08-03', 10                 , 6           );
EOF
psql women_health_db postgres << EOF
  INSERT INTO symptom (name      )
  VALUES              ('acne'    ),
                      ('headache');
EOF

psql women_health_db postgres << EOF
  INSERT INTO medication_course ("name"     , "userId")
  VALUES                        ('duphaston', 1       ),
                                ('selen'    , 1       ),
                                ('zinc'     , 2       );
EOF


psql women_health_db postgres << EOF
  INSERT INTO medication_course_taking ("date"      ,  "time" , "isTaken", "medicationCourseId")
  VALUES                               ('2022-02-25',  '10:00', TRUE     , 1                   ),
                                       ('2022-02-25',  '22:00', FALSE    , 1                   ),
                                       ('2022-02-26',  '08:00', FALSE    , 3                   ),
                                       ('2022-02-27',  '08:00', FALSE    , 3                   );
EOF


psql women_health_db postgres << EOF
  INSERT INTO period_intensity (slug    )
  VALUES                       ('light' ),
                               ('medium');
EOF

psql women_health_db postgres << EOF
  INSERT INTO mood (slug  )
  VALUES           ('good'),
                   ('sad' );
EOF

psql women_health_db postgres << EOF
  INSERT INTO period_record ("userId", "date"      , "moodSlug", "intensitySlug")
  VALUES                    (1       , '2022-10-02', 'good'    , 'light'        ),
                            (1       , '2022-10-05', 'good'    , 'medium'       ),
                            (2       , '2022-10-02', 'sad'     , 'medium'       ),
                            (2       , '2022-10-11', 'sad'     , 'light'        );
EOF

psql women_health_db postgres << EOF
  INSERT INTO period_record_symptoms_symptom ("periodRecordId", "symptomId")
  VALUES                                     (1               , 2          ),
                                             (2               , 1          ),
                                             (2               , 2          ),
                                             (3               , 1          ),
                                             (4               , 2          );
EOF



# Create testing database template.
psql -U postgres -c "DROP DATABASE IF EXISTS women_health_testing_template WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE women_health_testing_template WITH TEMPLATE women_health_db ENCODING 'UTF-8';";



# Restore DB from testing template.
psql -U postgres -c "DROP DATABASE IF EXISTS women_health_db WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE women_health_db WITH TEMPLATE women_health_testing_template ENCODING 'UTF-8';";
