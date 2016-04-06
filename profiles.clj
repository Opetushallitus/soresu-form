{
 :soresu-lib {:repositories [["releases" {:url "https://artifactory.oph.ware.fi/artifactory/oph-sade-release-local"
                                          :sign-releases false
                                          :snapshots false
                                          :creds :gpg}]
                             ["snapshots"      {:url "https://artifactory.oph.ware.fi/artifactory/oph-sade-snapshot-local"
                                                :creds :gpg}]
                      ["ext-snapshots"  {:url "https://artifactory.oph.ware.fi/artifactory/ext-snapshot-local"}]
                      ["Laughing Panda" {:url "http://maven.laughingpanda.org/maven2"
                                         :snapshots false}]]}
 :ci {:env {}}
}
