-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHash" TEXT NOT NULL,
    "rolePlateforme" TEXT NOT NULL DEFAULT 'GESTIONNAIRE',
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etablissements" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "telephone" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "etablissements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annees_scolaires" (
    "id" TEXT NOT NULL,
    "idEtablissement" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "annees_scolaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "idAnnee" TEXT NOT NULL,
    "idEtablissement" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eleves" (
    "id" TEXT NOT NULL,
    "idEtablissement" TEXT NOT NULL,
    "idClasse" TEXT,
    "matricule" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3),
    "sexe" TEXT,
    "adresse" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eleves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frais" (
    "id" TEXT NOT NULL,
    "idClasse" TEXT NOT NULL,
    "idEtablissement" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "montantInitial" DECIMAL(12,2) NOT NULL,
    "dateEcheance" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "frais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frais_eleves" (
    "id" TEXT NOT NULL,
    "idEleve" TEXT NOT NULL,
    "idFrais" TEXT NOT NULL,
    "montantInitial" DECIMAL(12,2) NOT NULL,
    "montantNet" DECIMAL(12,2) NOT NULL,
    "dateAttribution" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "frais_eleves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiements" (
    "id" TEXT NOT NULL,
    "idEtablissement" TEXT NOT NULL,
    "idEleve" TEXT NOT NULL,
    "idUtilisateur" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "modePaiement" TEXT NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'CONFIRME',

    CONSTRAINT "paiements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affectations_paiement" (
    "id" TEXT NOT NULL,
    "idPaiement" TEXT NOT NULL,
    "idFraisEleve" TEXT NOT NULL,
    "montantAffecte" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "affectations_paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compteurs_recu" (
    "id" TEXT NOT NULL,
    "idAnnee" TEXT NOT NULL,
    "dernierNumero" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "compteurs_recu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recus" (
    "id" TEXT NOT NULL,
    "idPaiement" TEXT NOT NULL,
    "idEtablissement" TEXT NOT NULL,
    "numeroRecu" TEXT NOT NULL,
    "dateEmission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'DEFINITIF',

    CONSTRAINT "recus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caisses" (
    "id" TEXT NOT NULL,
    "idEtablissement" TEXT NOT NULL,
    "nom" TEXT NOT NULL DEFAULT 'Caisse principale',
    "soldeInitial" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "caisses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depenses" (
    "id" TEXT NOT NULL,
    "idEtablissement" TEXT NOT NULL,
    "idUtilisateur" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT,
    "montantTotal" DECIMAL(12,2) NOT NULL,
    "modePaiement" TEXT,
    "dateDepense" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'PAYE',

    CONSTRAINT "depenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mouvements_caisse" (
    "id" TEXT NOT NULL,
    "idCaisse" TEXT NOT NULL,
    "typeMouvement" TEXT NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "dateMouvement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idPaiement" TEXT,
    "idDepense" TEXT,
    "idUtilisateur" TEXT,

    CONSTRAINT "mouvements_caisse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "annees_scolaires_idEtablissement_libelle_key" ON "annees_scolaires"("idEtablissement", "libelle");

-- CreateIndex
CREATE UNIQUE INDEX "classes_idAnnee_nom_key" ON "classes"("idAnnee", "nom");

-- CreateIndex
CREATE UNIQUE INDEX "eleves_idEtablissement_matricule_key" ON "eleves"("idEtablissement", "matricule");

-- CreateIndex
CREATE UNIQUE INDEX "frais_eleves_idEleve_idFrais_key" ON "frais_eleves"("idEleve", "idFrais");

-- CreateIndex
CREATE UNIQUE INDEX "paiements_reference_key" ON "paiements"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "affectations_paiement_idPaiement_idFraisEleve_key" ON "affectations_paiement"("idPaiement", "idFraisEleve");

-- CreateIndex
CREATE UNIQUE INDEX "compteurs_recu_idAnnee_key" ON "compteurs_recu"("idAnnee");

-- CreateIndex
CREATE UNIQUE INDEX "recus_idPaiement_key" ON "recus"("idPaiement");

-- CreateIndex
CREATE UNIQUE INDEX "recus_idEtablissement_numeroRecu_key" ON "recus"("idEtablissement", "numeroRecu");

-- CreateIndex
CREATE UNIQUE INDEX "caisses_idEtablissement_key" ON "caisses"("idEtablissement");

-- CreateIndex
CREATE UNIQUE INDEX "mouvements_caisse_idPaiement_key" ON "mouvements_caisse"("idPaiement");

-- CreateIndex
CREATE UNIQUE INDEX "mouvements_caisse_idDepense_key" ON "mouvements_caisse"("idDepense");

-- AddForeignKey
ALTER TABLE "annees_scolaires" ADD CONSTRAINT "annees_scolaires_idEtablissement_fkey" FOREIGN KEY ("idEtablissement") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_idAnnee_fkey" FOREIGN KEY ("idAnnee") REFERENCES "annees_scolaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleves" ADD CONSTRAINT "eleves_idEtablissement_fkey" FOREIGN KEY ("idEtablissement") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleves" ADD CONSTRAINT "eleves_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frais" ADD CONSTRAINT "frais_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frais" ADD CONSTRAINT "frais_idEtablissement_fkey" FOREIGN KEY ("idEtablissement") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frais_eleves" ADD CONSTRAINT "frais_eleves_idEleve_fkey" FOREIGN KEY ("idEleve") REFERENCES "eleves"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frais_eleves" ADD CONSTRAINT "frais_eleves_idFrais_fkey" FOREIGN KEY ("idFrais") REFERENCES "frais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_idEtablissement_fkey" FOREIGN KEY ("idEtablissement") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_idEleve_fkey" FOREIGN KEY ("idEleve") REFERENCES "eleves"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affectations_paiement" ADD CONSTRAINT "affectations_paiement_idPaiement_fkey" FOREIGN KEY ("idPaiement") REFERENCES "paiements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affectations_paiement" ADD CONSTRAINT "affectations_paiement_idFraisEleve_fkey" FOREIGN KEY ("idFraisEleve") REFERENCES "frais_eleves"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compteurs_recu" ADD CONSTRAINT "compteurs_recu_idAnnee_fkey" FOREIGN KEY ("idAnnee") REFERENCES "annees_scolaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recus" ADD CONSTRAINT "recus_idPaiement_fkey" FOREIGN KEY ("idPaiement") REFERENCES "paiements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recus" ADD CONSTRAINT "recus_idEtablissement_fkey" FOREIGN KEY ("idEtablissement") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caisses" ADD CONSTRAINT "caisses_idEtablissement_fkey" FOREIGN KEY ("idEtablissement") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depenses" ADD CONSTRAINT "depenses_idEtablissement_fkey" FOREIGN KEY ("idEtablissement") REFERENCES "etablissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depenses" ADD CONSTRAINT "depenses_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvements_caisse" ADD CONSTRAINT "mouvements_caisse_idCaisse_fkey" FOREIGN KEY ("idCaisse") REFERENCES "caisses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvements_caisse" ADD CONSTRAINT "mouvements_caisse_idPaiement_fkey" FOREIGN KEY ("idPaiement") REFERENCES "paiements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvements_caisse" ADD CONSTRAINT "mouvements_caisse_idDepense_fkey" FOREIGN KEY ("idDepense") REFERENCES "depenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvements_caisse" ADD CONSTRAINT "mouvements_caisse_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
