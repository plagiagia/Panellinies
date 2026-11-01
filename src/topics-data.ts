export type Topic = {
  id: string;
  subject: 'math' | 'physics';
  name: string;
  related: string[];
  questions: { year: number; id: string; description: string }[];
};

export const topics: Topic[] = [
  { id: 'derivatives', subject: 'math', name: 'Παράγωγοι', related: ['continuity', 'monotonicity', 'convexity'], questions: [{year:2026,id:'a1',description:'Μηδενική παράγωγος και σταθερή συνάρτηση'}, {year:2026,id:'a4',description:'Παραγωγισιμότητα, κυρτότητα και κανόνες παραγώγισης'}, {year:2026,id:'c1',description:'Εφαπτομένη γραφικής παράστασης'}, {year:2026,id:'d2',description:'Παραγωγισιμότητα συνάρτησης κατά κλάδους'}] },
  { id: 'continuity', subject: 'math', name: 'Συνέχεια συναρτήσεων', related: ['derivatives', 'limits', 'roots'], questions: [{year:2026,id:'a1',description:'Συνέχεια και σταθερή συνάρτηση'}, {year:2026,id:'a4',description:'Παραγωγισιμότητα και συνέχεια'}, {year:2026,id:'d1',description:'Ύπαρξη και μοναδικότητα ρίζας'}, {year:2026,id:'d3',description:'Ύπαρξη και μοναδικότητα ρίζας'}] },
  { id: 'limits', subject: 'math', name: 'Όρια', related: ['continuity', 'asymptotes'], questions: [{year:2026,id:'a2',description:'Κριτήριο παρεμβολής'}, {year:2026,id:'b3',description:'Υπολογισμός ορίου'}, {year:2026,id:'c1',description:'Οριζόντια ασύμπτωτη'}] },
  { id: 'monotonicity', subject: 'math', name: 'Μονοτονία και ακρότατα', related: ['derivatives', 'roots'], questions: [{year:2026,id:'c2',description:'Μελέτη μονοτονίας, ακροτάτων και συνόλου τιμών'}, {year:2026,id:'d1',description:'Μοναδικότητα ρίζας'}, {year:2026,id:'d3',description:'Πρόσημο συνάρτησης και μοναδικότητα ρίζας'}] },
  { id: 'convexity', subject: 'math', name: 'Κυρτότητα', related: ['derivatives'], questions: [{year:2026,id:'a4',description:'Δεύτερη παράγωγος και κυρτότητα'}] },
  { id: 'integrals', subject: 'math', name: 'Ολοκληρώματα και παράγουσες', related: ['area'], questions: [{year:2026,id:'a3',description:'Ορισμός παράγουσας'}, {year:2026,id:'c3',description:'Σχέση και υπολογισμός ολοκληρωμάτων'}, {year:2026,id:'d4',description:'Ολοκλήρωμα και εμβαδά'}] },
  { id: 'area', subject: 'math', name: 'Εμβαδά χωρίων', related: ['integrals'], questions: [{year:2026,id:'d4',description:'Ισεμβαδικά χωρία και ολοκλήρωμα'}] },
  { id: 'functions', subject: 'math', name: 'Σύνθεση και αντίστροφη συνάρτηση', related: ['logarithms'], questions: [{year:2026,id:'a4',description:'Συνάρτηση 1-1 και παράγωγος σύνθεσης'}, {year:2026,id:'b1',description:'Σύνθεση συναρτήσεων'}, {year:2026,id:'b2',description:'Αντίστροφη συνάρτηση'}] },
  { id: 'logarithms', subject: 'math', name: 'Λογαριθμικές συναρτήσεις', related: ['functions', 'limits'], questions: [{year:2026,id:'b1',description:'Σύνθεση με λογάριθμο'}, {year:2026,id:'b2',description:'Αντιστροφή λογαριθμικής συνάρτησης'}, {year:2026,id:'b3',description:'Όριο λογαριθμικής συνάρτησης'}] },
  { id: 'asymptotes', subject: 'math', name: 'Ασύμπτωτες', related: ['limits'], questions: [{year:2026,id:'c1',description:'Οριζόντια ασύμπτωτη'}] },
  { id: 'roots', subject: 'math', name: 'Ρίζες εξισώσεων', related: ['continuity', 'monotonicity'], questions: [{year:2026,id:'c2',description:'Πλήθος ριζών με παράμετρο'}, {year:2026,id:'d1',description:'Ύπαρξη και μοναδικότητα ρίζας'}, {year:2026,id:'d3',description:'Μοναδική ρίζα εξίσωσης'}] },
  { id: 'waves', subject: 'physics', name: 'Μηχανικά κύματα', related: ['standing-waves', 'oscillations'], questions: [{year:2026,id:'a2',description:'Μέγεθη αρμονικού κύματος'}] },
  { id: 'standing-waves', subject: 'physics', name: 'Στάσιμα κύματα', related: ['waves', 'oscillations'], questions: [{year:2026,id:'b1',description:'Δεσμοί χορδής και περίοδοι'}] },
  { id: 'oscillations', subject: 'physics', name: 'Ταλαντώσεις', related: ['waves', 'induction'], questions: [{year:2026,id:'a5',description:'Συντονισμός εξαναγκασμένης ταλάντωσης'}, {year:2026,id:'d1',description:'Εξίσωση απλής αρμονικής ταλάντωσης'}, {year:2026,id:'d2',description:'Ενέργεια και επιτάχυνση ταλάντωσης'}] },
  { id: 'rotation', subject: 'physics', name: 'Στροφική κίνηση και ισορροπία', related: ['collisions'], questions: [{year:2026,id:'a1',description:'Διατήρηση στροφορμής'}, {year:2026,id:'b3',description:'Ισορροπία συγκολλημένων ράβδων'}] },
  { id: 'collisions', subject: 'physics', name: 'Κρούσεις', related: ['rotation'], questions: [{year:2026,id:'a4',description:'Κεντρική ελαστική κρούση'}, {year:2026,id:'a5',description:'Ενέργεια στην ελαστική κρούση'}] },
  { id: 'electromagnetism', subject: 'physics', name: 'Μαγνητικό πεδίο και δυνάμεις', related: ['induction', 'alternating'], questions: [{year:2026,id:'b2',description:'Δύναμη μεταξύ παράλληλων αγωγών'}, {year:2026,id:'d3',description:'Κίνηση αγωγού σε μαγνητικό πεδίο'}] },
  { id: 'induction', subject: 'physics', name: 'Ηλεκτρομαγνητική επαγωγή', related: ['electromagnetism', 'oscillations'], questions: [{year:2026,id:'a5',description:'Συντελεστής αυτεπαγωγής'}, {year:2026,id:'d3',description:'Αγωγός που κινείται σε μαγνητικό πεδίο'}, {year:2026,id:'d4',description:'Έργο και θερμότητα σε κύκλωμα'}] },
  { id: 'alternating', subject: 'physics', name: 'Εναλλασσόμενο ρεύμα', related: ['electromagnetism'], questions: [{year:2026,id:'a3',description:'Ενεργές τιμές οργάνων μέτρησης'}] },
  { id: 'em-waves', subject: 'physics', name: 'Ηλεκτρομαγνητικά κύματα', related: ['quantum'], questions: [{year:2026,id:'a5',description:'Ηλεκτρικά και μαγνητικά πεδία'}] },
  { id: 'quantum', subject: 'physics', name: 'Κβαντική φυσική', related: ['compton', 'photoelectric', 'em-waves'], questions: [{year:2026,id:'a5',description:'Κυματική φύση σωματιδίων κατά de Broglie'}] },
  { id: 'compton', subject: 'physics', name: 'Φαινόμενο Compton', related: ['quantum', 'photoelectric'], questions: [{year:2026,id:'c1',description:'Μήκος κύματος σκεδαζόμενου φωτονίου'}, {year:2026,id:'c2',description:'Ενέργεια φωτονίων και ηλεκτρονίου'}] },
  { id: 'photoelectric', subject: 'physics', name: 'Φωτοηλεκτρικό φαινόμενο', related: ['quantum', 'compton'], questions: [{year:2026,id:'c3',description:'Συχνότητα κατωφλίου'}, {year:2026,id:'c4',description:'Δυναμικό αποκοπής'}] },
];

const questions2025: Record<string, { id: string; description: string }[]> = {
  derivatives: [{id:'a4',description:'Κανόνας αλυσίδας'}, {id:'b1',description:'Τοπικό ακρότατο και παράγωγος'}, {id:'b4',description:'Εφαπτόμενες'}, {id:'c1',description:'Παραγωγισιμότητα στο μηδέν'}, {id:'c4',description:'Ρυθμοί μεταβολής'}, {id:'d1',description:'Σταθερή συνάρτηση και παράγωγος'}],
  continuity: [{id:'a2',description:'Θεώρημα ενδιάμεσων τιμών'}, {id:'c1',description:'Συνέχεια στο μηδέν'}, {id:'c3',description:'Τομή γραφικών παραστάσεων'}],
  limits: [{id:'a4',description:'Όριο δύναμης'}, {id:'c2',description:'Ασύμπτωτες'}, {id:'d2',description:'Υπολογισμός ορίου'}],
  monotonicity: [{id:'b1',description:'Τοπικό ακρότατο'}, {id:'b2',description:'Ρίζες πολυωνύμου'}, {id:'d3',description:'Μονοτονία και εξίσωση'}],
  convexity: [{id:'a4',description:'Κυρτότητα και εφαπτομένη'}, {id:'b3',description:'Κυρτότητα και σημεία καμπής'}],
  integrals: [{id:'a1',description:'Παράγουσες συνάρτησης'}, {id:'d1',description:'Σχέση συνάρτησης και παράγουσας'}, {id:'d4',description:'Εμβαδόν χωρίου'}],
  area: [{id:'d4',description:'Εμβαδόν χωρίου'}],
  functions: [{id:'a4',description:'Αντίστροφη και σύνθεση συναρτήσεων'}],
  logarithms: [{id:'d1',description:'Σχέση με λογάριθμο'}, {id:'d2',description:'Όριο και παράγουσα'}, {id:'d3',description:'Μονοτονία λογαριθμικής συνάρτησης'}],
  asymptotes: [{id:'a3',description:'Ορισμός κατακόρυφης ασύμπτωτης'}, {id:'c2',description:'Ασύμπτωτες γραφικής παράστασης'}],
  roots: [{id:'b2',description:'Τρεις θετικές ρίζες πολυωνύμου'}, {id:'c3',description:'Τομή γραφικής παράστασης με ευθεία'}, {id:'d3',description:'Λύση εξίσωσης'}],
  waves: [{id:'a5',description:'Επαλληλία κυμάτων'}, {id:'b2',description:'Στιγμιότυπο και φάση κύματος'}],
  oscillations: [{id:'a4',description:'Εξαναγκασμένη ταλάντωση'}, {id:'d3',description:'Έργο ελατηρίου σε ταλάντωση'}],
  rotation: [{id:'d1',description:'Ισορροπία στεφάνης και δοκού'}, {id:'d2',description:'Κύλιση στεφάνης'}, {id:'d4',description:'Δύναμη δαπέδου στη δοκό'}],
  collisions: [{id:'a2',description:'Πλάγια ελαστική κρούση'}, {id:'b1',description:'Κεντρική πλαστική κρούση'}],
  electromagnetism: [{id:'a3',description:'Δύναμη σε κινούμενο φορτίο'}, {id:'c4',description:'Δύναμη μεταξύ αγωγών'}],
  induction: [{id:'a1',description:'Ηλεκτρεγερτική δύναμη αυτεπαγωγής'}, {id:'c1',description:'ΗΕΔ από μεταβαλλόμενο πεδίο'}, {id:'c2',description:'Στρεφόμενο πλαίσιο και θερμότητα'}, {id:'c3',description:'Γωνιακή ταχύτητα και εκλυόμενη θερμότητα'}],
  alternating: [{id:'c2',description:'Στρεφόμενο πλαίσιο και θερμότητα'}, {id:'c3',description:'Μεταβολή θερμότητας ανά περιστροφή'}],
  'em-waves': [{id:'a5',description:'Μέλαν σώμα και ηλεκτρομαγνητικά κύματα'}],
  quantum: [{id:'a5',description:'Αρχή αβεβαιότητας και μέλαν σώμα'}],
  compton: [{id:'b3',description:'Σκέδαση Compton και ενέργεια φωτονίου'}],
  photoelectric: [{id:'a5',description:'Έργο εξαγωγής φωτοηλεκτρονίων'}],
};

for (const topic of topics) {
  topic.questions.push(...(questions2025[topic.id] ?? []).map(question => ({ ...question, year: 2025 })));
}
