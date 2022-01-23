import { ConnectionPool, IProcedureResult, MAX, Request as SqlRequest, TYPES } from 'mssql';
import { ISubject, ISubjectAssignedHistory } from 'src/entities/subject';
import { sqlNVarChar, sqlVarChar } from '~shared';


interface ISubjectDTO {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: Date;
  sirutaId: number;
}

/**
 * User Data Access
 */
export class SubjectDao {
  private sql: ConnectionPool;

  /**
   * @param {ConnectionPool} pool Connection pool to use
   */
  constructor(pool: ConnectionPool) {
    this.sql = pool;
  }

  /**
   * Get subject by id
   * @param {number} id
   * @return {Promise<ISubject>}
   */
  public async getById(id: number): Promise<ISubject> {
    try {
      const result = await new SqlRequest(this.sql)
        .input('id', TYPES.Int, id)
        .execute('getSubjectById');
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {ISubjectDTO} subject
   */
  public async add(subject: ISubjectDTO): Promise<IProcedureResult<any>> {
    try {
      const sqlReq = new SqlRequest(this.sql)
        .input('firstName', sqlNVarChar(100), subject.firstName)
        .input('middleName', sqlNVarChar(100), subject.middleName || null)
        .input('lastName', sqlNVarChar(100), subject.lastName)
        .input('dob', TYPES.Date, subject.dob)
        .input('sirutaId', TYPES.Int, subject.sirutaId)
        .output('subjectId', TYPES.Int);

      const result = await sqlReq.execute('subjectAdd');
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {ISubjectDTO} subject
   */
  public async update(subject: ISubjectDTO): Promise<IProcedureResult<any>> {
    try {
      const sqlReq = new SqlRequest(this.sql)
        .input('id', TYPES.Int, subject.id)
        .input('firstName', sqlNVarChar(100), subject.firstName)
        .input('middleName', sqlNVarChar(100), subject.middleName || null)
        .input('lastName', sqlNVarChar(100), subject.lastName)
        .input('dob', TYPES.Date, subject.dob)
        .input('sirutaId', TYPES.Int, subject.sirutaId);

      const result = await sqlReq.execute('subjectUpdate');
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {number} id
   * @param {string} notes
   */
  public async updateNotes(id: number, notes: string): Promise<IProcedureResult<any>> {
    try {
      const sqlReq = new SqlRequest(this.sql)
        .input('id', TYPES.Int, id)
        .input('notes', sqlVarChar(MAX), notes);

      const result = await sqlReq.execute('subjectUpdateNotes');
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {number} id
   */
  public async delete(id: number): Promise<IProcedureResult<any>> {
    try {
      const sqlReq = new SqlRequest(this.sql)
        .input('id', TYPES.Int, id);

      const result = await sqlReq.execute('subjectDelete');
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get subject list
   * @param {number} userId
   * @param {boolean} deleted
   * @return {Promise<ISubject[]>}
   */
  public async list(userId: number, deleted: boolean): Promise<ISubject[]> {
    try {
      const result = await new SqlRequest(this.sql)
        .input('userId', TYPES.Int, userId)
        .input('deleted', TYPES.TinyInt, deleted ? 1 : 0)
        .execute('subjectList');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get subject assigned history
   * @param {number} id
   * @return {Promise<ISubjectAssignedHistory[]>}
   */
  public async assignedHistory(id: number): Promise<ISubjectAssignedHistory[]> {
    try {
      const result = await new SqlRequest(this.sql)
        .input('id', TYPES.Int, id)
        .execute('getSubjectAssignedHistory');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}