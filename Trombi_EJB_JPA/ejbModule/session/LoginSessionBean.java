package session;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import model.Compte;

/**
 * Session Bean implementation class LoginSessionBean
 */
@Stateless
@LocalBean
public class LoginSessionBean implements LoginSessionBeanRemote {
	@PersistenceContext(unitName = "SR03DB")
    private EntityManager entityManager;
	
	public LoginSessionBean() { }
	
	@Override
	public Compte getUser(String pseudo) {
		Compte compte = entityManager.find(Compte.class, pseudo);
		return compte;
	}
	
}
