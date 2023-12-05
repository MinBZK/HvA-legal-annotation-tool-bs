import { Label } from "./models/Label";
import { Relation } from "./models/Relation";

export function loadRelations() {
    // Should get relationships from db/localstorage
    // Fake data

    let [rechtsSubject, rechtsObject, voorwaarden] = loadLabels();

    return [
        new Relation(1, rechtsSubject, rechtsSubject, "Is specialisatie van"),
        new Relation(2, rechtsSubject, voorwaarden, "Is geldig indien voldaan aan"),
        new Relation(3, rechtsObject, rechtsObject, "Is specialisatie van"),
        new Relation(4, rechtsObject, voorwaarden, "Is geldig indien voldaan aan")
    ];
}

export function loadLabels() {
    // Should get labels from db

    return [
        new Label(1, "Rechtssubject", "red", null as any, ""),
        new Label(2, "Rechtsobject", "blue", null as any, ""),
        new Label(3, "voorwaarden", "green", null as any, "")
    ];
}