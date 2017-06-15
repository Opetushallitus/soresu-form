(ns oph.soresu.form.validation-spec
  (:require [speclj.core :refer :all]
            [oph.soresu.form.validation :refer :all]))

(defn- answers-for [field value]
  (let [field-id (:id field)
        field-type (:fieldType field)]
    {:value [{:key field-id
              :value value
              :fieldType field-type}]}))

(def email-field
  {:id         "email"
   :fieldClass "formField"
   :fieldType  "emailField"
   :required   true})

(def finnish-business-id-field
  {:id         "y-tunnus"
   :fieldClass "formField"
   :fieldType  "finnishBusinessIdField"
   :required   true})

(describe "validation"
  (it "validates email"
      (let [result (validate-field (answers-for email-field "testi@test.org") [] email-field)]
        (should= {:email []} result)))

  (it "validates email with +part"
      (let [result (validate-field (answers-for email-field "testi+extra@test.org") [] email-field)]
        (should= {:email []} result)))

  (it "validates email with no @ as invalid"
      (let [result (validate-field (answers-for  email-field "testitest.org") [] email-field)]
        (should= {:email [{:error "email"}]} result)))

  (it "validates email with only one domain part as invalid"
      (let [result (validate-field (answers-for email-field "testi@test") [] email-field)]
        (should= {:email [{:error "email"}]} result)))

  (it "validates empty email as required"
      (let [result (validate-field (answers-for email-field "") [] email-field)]
        (should= {:email [{:error "required"}]} result)))

  (it "validates empty finnish-business-id-field as required"
      (let [result (validate-field (answers-for finnish-business-id-field nil) [] finnish-business-id-field)]
        (should= {:y-tunnus [{:error "required"}]} result)))

  (it "validates finnish business with checksum 0"
      (let [result (validate-field (answers-for finnish-business-id-field "0165761-0") [] finnish-business-id-field)]
        (should= {:y-tunnus []} result)))

  (it "validates common valid finnish business id"
      (let [result (validate-field (answers-for finnish-business-id-field "1629284-5") [] finnish-business-id-field)]
        (should= {:y-tunnus []} result)))

  (it "validates valid finnish business id with checksum 0"
      (let [result (validate-field (answers-for finnish-business-id-field "0165761-0") [] finnish-business-id-field)]
        (should= {:y-tunnus []} result)))

  (it "validates empty finnish business id as required"
      (let [result (validate-field (answers-for finnish-business-id-field "") [] finnish-business-id-field)]
        (should= {:y-tunnus [{:error "required"}]} result)))

  (it "validates finnish business id with wrong checskum as invalid"
      (let [result (validate-field (answers-for finnish-business-id-field "1629284-6") [] finnish-business-id-field)]
        (should= {:y-tunnus [{:error "finnishBusinessId"}]} result)))

  (it "validates finnish business id with wrong syntax as invalid"
      (let [result (validate-field (answers-for finnish-business-id-field "165761-0") [] finnish-business-id-field)]
        (should= {:y-tunnus [{:error "finnishBusinessId"}]} result))))

(run-specs)
