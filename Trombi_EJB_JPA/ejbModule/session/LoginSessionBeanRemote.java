package session;

import javax.ejb.Remote;

import model.Compte;

@Remote
public interface LoginSessionBeanRemote {
	Compte getUser(String pseudo);
}
