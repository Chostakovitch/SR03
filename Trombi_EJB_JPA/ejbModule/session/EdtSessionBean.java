package session;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import model.Edt;
import model.Inscription;

/**
 * Session Bean implementation class EdtSessionBean
 */
@Stateless
public class EdtSessionBean implements EdtSessionBeanRemote {
	@PersistenceContext(unitName = "SR03DB")
    private EntityManager entityManager;
	
	private static final String paramEmail = "email";
	private static final String queryGetEdt = "SELECT i.edt.jour, i.edt.salle, i.edt.uv, i.edt.duree, i.edt.type, i.edt.id.heureDebut FROM " + Inscription.class.getName() + " i WHERE i.etudiant.mail=:" + paramEmail;
	
    public EdtSessionBean() { }

	@Override
	public List<Edt> getEdt(String email) {
		Query q = entityManager.createQuery(queryGetEdt);
		q.setParameter(paramEmail, email);
		List<Edt> edt = q.getResultList();
		return edt;
	}

}
