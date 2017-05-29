package session;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import model.Etudiant;

/**
 * Session Bean implementation class EtudiantSessionBean
 */
@Stateless
public class EtudiantSessionBean implements EtudiantSessionBeanRemote {
    @PersistenceContext(unitName = "SR03DB")
    private EntityManager entityManager;
    
    public EtudiantSessionBean() { }
    private static final String queryGetAllStudents = "SELECT e FROM " + Etudiant.class.getName() +  " e";
    private static final String querySearchStudent = "SELECT e FROM " + Etudiant.class.getName() + " e";
    private static final String nameParameter = "nom";
    private static final String surnameParameter = "prenom";
    private static final String fragmentName = " e.nom like :" + nameParameter;
    private static final String fragmentSurname = " e.prenom like :" + surnameParameter;
    private static final String where = " WHERE ";
    private static final String and = " AND ";
    
    public Etudiant getEtudiant(String email) {
    	Etudiant e = entityManager.find(Etudiant.class, email);
    	return e;
    }
    
    public List<Etudiant> searchEtudiant(String prenom, String nom) {
    	String finalQuery = querySearchStudent;
    	if(prenom != null && !prenom.trim().isEmpty()) {
    		finalQuery += where;
    		finalQuery += fragmentSurname;
    		if(nom != null && !nom.trim().isEmpty()) {
    			finalQuery += and;
    			finalQuery += fragmentName;
    		}
    	}
    	else if(nom != null && !nom.trim().isEmpty()) {
			finalQuery += where;
			finalQuery += fragmentName;
		}
    	TypedQuery<Etudiant> q = entityManager.createQuery(finalQuery, Etudiant.class);
    	//Au cas où un seul est présent, on se permet de catch l'exception
    	try {
    		q.setParameter(nameParameter, nom);
    	} catch(Exception e) { }
    	try {
    		q.setParameter(surnameParameter, prenom);
    	} catch(Exception e) { }
    	List<Etudiant> etudiants = q.getResultList();
    	return etudiants;
    }
    
    public List<Etudiant> getAllEtudiants() {
    	TypedQuery<Etudiant> q = entityManager.createQuery(queryGetAllStudents, Etudiant.class);
    	List<Etudiant> etudiants = q.getResultList();
    	return etudiants;
    }
}
