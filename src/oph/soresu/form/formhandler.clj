(ns oph.soresu.form.formhandler
  (require [oph.soresu.form.formutil :as formutil]
           [oph.soresu.common.koodisto :as koodisto]))

(defn- process-koodisto-field [node operation]
  (if (= "koodistoField" (:fieldType node))
      (operation node)
      node))

(defn- add-koodisto-options [koodisto-field-node]
  (let [koodisto-params (-> koodisto-field-node :params :koodisto)
        koodisto-uri (:uri koodisto-params)
        version (:version koodisto-params)]
    (assoc koodisto-field-node :options (koodisto/get-koodi-options koodisto-uri version))))

(defn- set-field-type-from-params [koodisto-field-node]
  (assoc koodisto-field-node :fieldType (-> koodisto-field-node :params :inputType)))

(defn- add-options-to-koodisto-fields [node]
  (process-koodisto-field node add-koodisto-options))

(defn- set-koodisto-field-fieldtypes [node]
  (process-koodisto-field node set-field-type-from-params))

(defn- transform [node-operation form]
  (formutil/transform-form-content form node-operation))

(defn add-koodisto-values [form]
  (->> form
       (transform add-options-to-koodisto-fields)
       (transform set-koodisto-field-fieldtypes)))
