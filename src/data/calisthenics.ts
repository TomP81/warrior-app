export type WorkoutExercise = {
  title: string;
  image: string;
  instructions: string;
  durationSeconds?: number;
};

export type CalisthenicsLevel = {
  id: number;
  name: string;
  description: string;
  series: number;
  restSeconds: number;
  warmup: WorkoutExercise;
  exercises: WorkoutExercise[];
  cooldown: WorkoutExercise;
};

export type CalisthenicsGoal = {
  id: string;
  name: string;
  description: string;
  levels: CalisthenicsLevel[];
};

// Chaque niveau se modifie indépendamment ci-dessous.
// durationSeconds définit le chrono en secondes ; retirer ce champ pour aucun chrono.
// series : nombre de tours ; restSeconds : repos entre les tours.

export const CALISTHENICS_GOALS: CalisthenicsGoal[] = [
  {
    "id": "bases",
    "name": "Les Bases",
    "description": "Quatre niveaux pour travailler les exercices de base.",
    "levels": [
      {
        "id": 1,
        "name": "Niveau 1",
        "description": "4 tours de 6 exercices : 2 chronométrés et 4 sans chrono.",
        "series": 4,
        "restSeconds": 120,
        "warmup": {
          "title": "Échauffement",
          "image": "/images/SW_ECHAUFFEMENT.png",
          "instructions": "Prépare-toi pour la séance, puis passe au premier exercice."
        },
        "exercises": [
          {
            "title": "Tractions",
            "image": "/images/SW_TRACTIONS_N1.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Pompes",
            "image": "/images/SW_POMPE_N1.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Pistol squats",
            "image": "/images/SW_JAMBES_N1.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Gainage",
            "image": "/images/SW_GAINAGE_N1.png",
            "instructions": "Lance le chrono pour cet exercice.",
            "durationSeconds": 30
          },
          {
            "title": "Dips",
            "image": "/images/SW_DIPS_N1.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "L-Sit",
            "image": "/images/SW_L-SIT_N1.png",
            "instructions": "Lance le chrono pour cet exercice.",
            "durationSeconds": 8
          }
        ],
        "cooldown": {
          "title": "Étirements",
          "image": "/images/SW_ETIREMENT.png",
          "instructions": "Termine tes étirements, puis valide la séance."
        }
      },
      {
        "id": 2,
        "name": "Niveau 2",
        "description": "4 tours de 7 exercices : 2 chronométrés et 5 sans chrono.",
        "series": 4,
        "restSeconds": 120,
        "warmup": {
          "title": "Échauffement",
          "image": "/images/SW_ECHAUFFEMENT.png",
          "instructions": "Prépare-toi pour la séance, puis passe au premier exercice."
        },
        "exercises": [
          {
            "title": "Tractions — N1",
            "image": "/images/SW_TRACTIONS_N1.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Pompes",
            "image": "/images/SW_POMPE_N2.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Tractions — N2",
            "image": "/images/SW_TRACTIONS_N2.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Pistol squats",
            "image": "/images/SW_JAMBES_N2.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Gainage",
            "image": "/images/SW_GAINAGE_N2.png",
            "instructions": "Lance le chrono pour cet exercice.",
            "durationSeconds": 30
          },
          {
            "title": "Dips",
            "image": "/images/SW_DIPS_N2.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "L-Sit",
            "image": "/images/SW_L-SIT_N2.png",
            "instructions": "Lance le chrono pour cet exercice.",
            "durationSeconds": 8
          }
        ],
        "cooldown": {
          "title": "Étirements",
          "image": "/images/SW_ETIREMENT.png",
          "instructions": "Termine tes étirements, puis valide la séance."
        }
      },
      {
        "id": 3,
        "name": "Niveau 3",
        "description": "4 tours de 7 exercices : 2 chronométrés et 5 sans chrono.",
        "series": 4,
        "restSeconds": 120,
        "warmup": {
          "title": "Échauffement",
          "image": "/images/SW_ECHAUFFEMENT.png",
          "instructions": "Prépare-toi pour la séance, puis passe au premier exercice."
        },
        "exercises": [
          {
            "title": "Tractions — N2",
            "image": "/images/SW_TRACTIONS_N2.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Pompes",
            "image": "/images/SW_POMPE_N2.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Tractions — N3",
            "image": "/images/SW_TRACTIONS_N3.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Pistol squats",
            "image": "/images/SW_JAMBES_N3.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Gainage",
            "image": "/images/SW_GAINAGE_N2.png",
            "instructions": "Lance le chrono pour cet exercice.",
            "durationSeconds": 60
          },
          {
            "title": "Dips",
            "image": "/images/SW_DIPS_N3.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "L-Sit",
            "image": "/images/SW_L-SIT_N3.png",
            "instructions": "Lance le chrono pour cet exercice.",
            "durationSeconds": 5
          }
        ],
        "cooldown": {
          "title": "Étirements",
          "image": "/images/SW_ETIREMENT.png",
          "instructions": "Termine tes étirements, puis valide la séance."
        }
      },
      {
        "id": 4,
        "name": "Niveau 4",
        "description": "4 tours de 7 exercices : 2 chronométrés et 5 sans chrono.",
        "series": 4,
        "restSeconds": 120,
        "warmup": {
          "title": "Échauffement",
          "image": "/images/SW_ECHAUFFEMENT.png",
          "instructions": "Prépare-toi pour la séance, puis passe au premier exercice."
        },
        "exercises": [
          {
            "title": "Tractions — N4",
            "image": "/images/SW_TRACTIONS_N4.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Pompes",
            "image": "/images/SW_POMPE_N4.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Tractions — N3",
            "image": "/images/SW_TRACTIONS_N3.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Pistol squats",
            "image": "/images/SW_JAMBES_N4.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "Gainage",
            "image": "/images/SW_GAINAGE_N1.png",
            "instructions": "Lance le chrono pour cet exercice.",
            "durationSeconds": 60
          },
          {
            "title": "Dips",
            "image": "/images/SW_DIPS_N4.png",
            "instructions": "Passe à la suite une fois ton exercice terminé."
          },
          {
            "title": "L-Sit",
            "image": "/images/SW_L-SIT_N4.png",
            "instructions": "Lance le chrono pour cet exercice.",
            "durationSeconds": 10
          }
        ],
        "cooldown": {
          "title": "Étirements",
          "image": "/images/SW_ETIREMENT.png",
          "instructions": "Termine tes étirements, puis valide la séance."
        }
      }
    ]
  },
  {
    "id": "figure-statique",
    "name": "Figure statique",
    "description": "Figures statiques : programmes à venir.",
    "levels": []
  },
  {
    "id": "figure-dynamique",
    "name": "Figure Dynamique",
    "description": "Figures dynamiques : programmes à venir.",
    "levels": []
  }
];
