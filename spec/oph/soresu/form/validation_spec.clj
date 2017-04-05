(ns oph.soresu.form.validation-spec
  (:require
    [speclj.core :refer :all]
    [oph.soresu.form.validation :refer :all]))

(def finnish-business-id-field
  {:id "y-tunnus"
   :fieldClass "formField"
   :fieldType "finnishBusinessIdField"
   :required true})

(def email-field
  {:id "email"
   :fieldClass "formField"
   :fieldType "emailField"
   :required true})

(describe "validation"
  (it "validates common email"
      (let [result (validate-email-field email-field "testi@test.org")]
        (should= [] result)))

  (it "validates common email with +part"
      (let [result (validate-email-field email-field "testi+extra@test.org")]
        (should= [] result)))

  (it "notices invalid email with no @"
      (let [result (validate-email-field email-field "testitest.org")]
        (should= [{:error "email"}] result)))

  (it "notices invalid email with only one domain part"
      (let [result (validate-email-field email-field "testi@test")]
        (should= [{:error "email"}] result)))

  (it "does not validate empty email"
      (let [result (validate-email-field email-field "")]
        (should= [] result)))

  (it "requires email if empty given"
      (let [result (validate-required email-field "")]
        (should= [{:error "required"}] result)))

  (it "requires finnish-business-id-field if no given"
      (let [result (validate-required finnish-business-id-field nil)]
        (should= [{:error "required"}] result)))

  (it "validates valid finnish business id with checskum 0"
      (let [result (validate-finnish-business-id-field finnish-business-id-field "0165761-0")]
        (should= [] result)))

  (it "validates common valid finnish business id"
    (let [result (validate-finnish-business-id-field finnish-business-id-field "1629284-5")]
      (should= [] result)))

  (it "validates valid finnish business id with checskum 0"
    (let [result (validate-finnish-business-id-field finnish-business-id-field "0165761-0")]
      (should= [] result)))

  (it "does not validate empty finnish business id"
      (let [result (validate-finnish-business-id-field finnish-business-id-field "")]
        (should= [] result)))

  (it "notices invalid finnish business id with wrong checskum"
      (let [result (validate-finnish-business-id-field finnish-business-id-field "1629284-6")]
        (should= [{:error "finnishBusinessId"}] result)))

  (it "notices invalid finnish business id with wrong syntax"
      (let [result (validate-finnish-business-id-field finnish-business-id-field "165761-0")]
        (should= [{:error "finnishBusinessId"}] result)))
)

(run-specs)
