package session;

import java.util.List;

import javax.ejb.Remote;

import model.Edt;
import model.Inscription;

@Remote
public interface EdtSessionBeanRemote {
	List<Edt> getEdt(String email);
}
