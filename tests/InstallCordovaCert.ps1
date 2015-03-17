param([String]$certPath)
$pfx = new-object System.Security.Cryptography.X509Certificates.X509Certificate2
$pfx.import($certPath, "", "Exportable, PersistKeySet")
$store = new-object System.Security.Cryptography.X509Certificates.X509Store("TrustedPeople", "LocalMachine")
$store.open("MaxAllowed")
$store.add($pfx)
$store.close()
