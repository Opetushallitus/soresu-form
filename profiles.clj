{
 :soresu-lib {:repositories [["releases" {:url "https://artifactory.oph.ware.fi/artifactory/oph-sade-release-local"
                                          :sign-releases false
                                          :snapshots false
                                          :username "bamboo"
                                          :password :env}]
                             ["snapshots" {:url "https://artifactory.oph.ware.fi/artifactory/oph-sade-snapshot-local"
                                           :username "bamboo"
                                           :password :env}]
                      ["ext-snapshots"  {:url "https://artifactory.oph.ware.fi/artifactory/ext-snapshot-local"}]
                      ["Laughing Panda" {:url "http://maven.laughingpanda.org/maven2"
                                         :snapshots false}]]}
 :ci {:env {}}
}
